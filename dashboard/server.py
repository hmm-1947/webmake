from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json, urllib.parse, mimetypes, re, sys, traceback

ROOT=Path(__file__).resolve().parents[1]
DASH=ROOT/'dashboard'; SPEC=DASH/'site.json'; INDEX=DASH/'index.html'; MEDIA=DASH/'media'; MEDIA.mkdir(exist_ok=True)
SITE_OUTPUT_DIR=ROOT/'output'/'site'  # fixed location; run `npm run dev` here once, it stays on http://localhost:3000

sys.path.insert(0, str(ROOT))
try:
    from engine.pipeline import generate_from_spec_dict, PipelineError
except Exception:
    generate_from_spec_dict = None
    PipelineError = Exception

def parse_multipart_file(body, content_type):
 """Minimal multipart/form-data parser to extract a single uploaded file (replaces the removed `cgi` module)."""
 m = re.search(r'boundary=(?:"([^"]+)"|([^;]+))', content_type)
 if not m: raise ValueError('No multipart boundary found')
 boundary = (m.group(1) or m.group(2)).strip().encode()
 delimiter = b'--' + boundary
 parts = body.split(delimiter)
 for part in parts:
  part = part.strip(b'\r\n')
  if not part or part == b'--': continue
  if b'\r\n\r\n' not in part: continue
  headers_raw, content = part.split(b'\r\n\r\n', 1)
  headers = headers_raw.decode('utf-8', 'replace')
  if 'filename=' not in headers: continue
  fn_match = re.search(r'filename="([^"]*)"', headers)
  filename = fn_match.group(1) if fn_match else 'upload'
  if content.endswith(b'\r\n'): content = content[:-2]
  return filename, content
 raise ValueError('No file part found in upload')

def regenerate_site(spec_dict):
 """Regenerate the Next.js project at SITE_OUTPUT_DIR from the given spec.
 Preserves node_modules so an already-running `npm run dev` on port 3000
 picks up the change via fast refresh instead of needing a reinstall.
 Returns (ok, info_dict)."""
 if generate_from_spec_dict is None:
  return False, {'error': 'engine.pipeline could not be imported'}
 try:
  result = generate_from_spec_dict(
   spec_dict,
   str(SITE_OUTPUT_DIR),
   overwrite=True,
   preserve_node_modules=True,
  )
  return True, {
   'outputDir': str(SITE_OUTPUT_DIR),
   'pagesWritten': result.get('pages_written', []),
   'needsInstall': not (SITE_OUTPUT_DIR / 'node_modules').is_dir(),
  }
 except PipelineError as e:
  return False, {'error': str(e)}
 except Exception as e:
  traceback.print_exc()
  return False, {'error': f'{type(e).__name__}: {e}'}

class Handler(BaseHTTPRequestHandler):
 def send_json(self,obj,status=200):
  data=json.dumps(obj,indent=2).encode(); self.send_response(status); self.send_header('Content-Type','application/json'); self.send_header('Content-Length',str(len(data))); self.end_headers(); self.wfile.write(data)
 def do_GET(self):
  path=urllib.parse.urlparse(self.path).path
  if path=='/api/site':
   try:self.send_json(json.loads(SPEC.read_text(encoding='utf-8')))
   except FileNotFoundError:self.send_json({'pages':[],'meta':{},'designSystem':{}},404)
  elif path=='/api/media':
   media=[]
   for p in MEDIA.iterdir():
    if p.is_file(): media.append({'name':p.name,'url':'/media/'+urllib.parse.quote(p.name),'type':'video' if p.suffix.lower() in {'.mp4','.webm','.mov'} else 'image'})
   self.send_json(media)
  elif path=='/api/setup':
   node_modules_ok=(SITE_OUTPUT_DIR/'node_modules').is_dir()
   self.send_json({
    'outputDir': str(SITE_OUTPUT_DIR),
    'nodeModulesExists': node_modules_ok,
    'sitePort': 3000,
    'siteUrl': 'http://localhost:3000',
    'engineAvailable': generate_from_spec_dict is not None,
   })
  elif path.startswith('/media/'):
   p=MEDIA/urllib.parse.unquote(path[7:])
   if not p.is_file():self.send_json({'error':'Not found'},404);return
   data=p.read_bytes();self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(str(p))[0] or 'application/octet-stream');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  elif path=='/preview' or path.startswith('/preview/'):
   PREVIEW=DASH/'preview.html'
   data=PREVIEW.read_bytes();self.send_response(200);self.send_header('Content-Type','text/html');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  else:
   data=INDEX.read_bytes();self.send_response(200);self.send_header('Content-Type','text/html');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 def do_POST(self):
  path=urllib.parse.urlparse(self.path).path
  if path=='/api/site':
   try:
    n=int(self.headers.get('Content-Length','0'));obj=json.loads(self.rfile.read(n));SPEC.parent.mkdir(exist_ok=True);SPEC.write_text(json.dumps(obj,indent=2),encoding='utf-8')
    regen_ok,regen_info=regenerate_site(obj)
    self.send_json({'ok':True,'regenerated':regen_ok,'site':regen_info})
   except Exception as e:self.send_json({'error':str(e)},400)
  elif path=='/api/media':
   try:
    n=int(self.headers.get('Content-Length','0'));body=self.rfile.read(n);filename,content=parse_multipart_file(body,self.headers.get('Content-Type',''));name=Path(filename).name;dest=MEDIA/name;dest.write_bytes(content);self.send_json({'ok':True,'name':name,'url':'/media/'+urllib.parse.quote(name)})
   except Exception as e:self.send_json({'error':str(e)},400)
  elif path=='/api/regenerate':
   try:
    obj=json.loads(SPEC.read_text(encoding='utf-8'))
    regen_ok,regen_info=regenerate_site(obj)
    self.send_json({'ok':regen_ok,'site':regen_info})
   except Exception as e:self.send_json({'error':str(e)},400)
  else:self.send_json({'error':'Not found'},404)

if __name__=='__main__':
 SPEC.parent.mkdir(exist_ok=True)
 if not SPEC.exists():SPEC.write_text(json.dumps({'meta':{'name':'My Website'},'pages':[],'designSystem':{}},indent=2),encoding='utf-8')
 print('Dashboard: http://localhost:8787')
 print('Live site (after npm install && npm run dev in output/site): http://localhost:3000')
 ThreadingHTTPServer(('127.0.0.1',8787),Handler).serve_forever()
