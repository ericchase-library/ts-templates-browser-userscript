import { default as node_fs } from 'node:fs';
import { NormalizedPath } from './lib/ericchase/Platform/FilePath.js';
import { ConsoleLog } from './lib/ericchase/Utility/Console.js';
import { server } from './route-server.js';

export async function get(req: Request, url: URL, pathname: string): Promise<Response | undefined> {
  ConsoleLog(`GET      ${pathname}`);

  // server api
  if (url.pathname === '/console') return server.getConsole();
  if (url.pathname.startsWith('/server')) return server.get(pathname);

  // custom routing here
  switch (pathname) {
    case '/': {
      return getPublicResource('index.html');
    }
  }

  return getPublicResource(pathname);
}

async function getPublicResource(pathname: string): Promise<Response | undefined> {
  if (Bun.env.PUBLIC_PATH) {
    const public_path = NormalizedPath(Bun.env.PUBLIC_PATH);
    try {
      if ((await node_fs.promises.stat(public_path.raw)).isDirectory() === false) {
        throw undefined;
      }
    } catch (error) {
      throw new Error(`PUBLIC_PATH "${Bun.env.PUBLIC_PATH}" does not exist or is not a directory.`);
    }
    const resource_path = NormalizedPath(public_path, pathname);
    if (resource_path.startsWith(public_path)) {
      const resource_file = Bun.file(resource_path.raw);
      if (await resource_file.exists()) {
        const response = new Response(resource_file);
        // NOTE: This lets your userscript access resources from the dev server
        // on any website. This server is intended for testing purposes! Do not
        // do this on a server accessible from the internet unless you really
        // know what you're doing!
        response.headers.append('Access-Control-Allow-Origin', '*');
        return response;
      }
    }
  }
}
