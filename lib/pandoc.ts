import {
  ConsoleStdout,
  File,
  Inode,
  OpenFile,
  PreopenDirectory,
  WASI,
} from '@bjorn3/browser_wasi_shim';

interface PandocWasmInstance extends WebAssembly.Instance {
  exports: {
    memory: WebAssembly.Memory;
    malloc: (size: number) => number;
    __wasm_call_ctors: () => void;
    hs_init_with_rtsopts: (argc: number, argv: number) => void;
    wasm_main: (args_ptr: number, args_len: number) => void;
  };
}

export async function initPandoc() {
  const args = ['pandoc.wasm', '+RTS', '-H64m', '-RTS'];
  const env: Array<string> = [];
  const inFile = new File(new Uint8Array(), { readonly: true });
  const outFile = new File(new Uint8Array(), { readonly: false });
  const fds = [
    new OpenFile(new File(new Uint8Array(), { readonly: true })),
    ConsoleStdout.lineBuffered((msg) => console.log(`[WASI stdout] ${msg}`)),
    ConsoleStdout.lineBuffered((msg) => console.warn(`[WASI stderr] ${msg}`)),
    new PreopenDirectory(
      '/',
      new Map<string, Inode>([
        ['in', inFile],
        ['out', outFile],
      ])
    ),
  ];
  const options = { debug: false };
  const wasi = new WASI(args, env, fds, options);
  const { instance } = await WebAssembly.instantiateStreaming(fetch('/pandoc.wasm'), {
    wasi_snapshot_preview1: wasi.wasiImport,
  });
  const wasmInstance = instance as unknown as PandocWasmInstance;

  wasi.initialize(wasmInstance);
  wasmInstance.exports.__wasm_call_ctors();

  function memoryDataView() {
    return new DataView(wasmInstance.exports.memory.buffer);
  }

  const argcPtr = wasmInstance.exports.malloc(4);
  memoryDataView().setUint32(argcPtr, args.length, true);
  const argv = wasmInstance.exports.malloc(4 * (args.length + 1));
  for (let i = 0; i < args.length; ++i) {
    const arg = wasmInstance.exports.malloc(args[i].length + 1);
    new TextEncoder().encodeInto(
      args[i],
      new Uint8Array(wasmInstance.exports.memory.buffer, arg, args[i].length)
    );
    memoryDataView().setUint8(arg + args[i].length, 0);
    memoryDataView().setUint32(argv + 4 * i, arg, true);
  }
  memoryDataView().setUint32(argv + 4 * args.length, 0, true);
  const argv_ptr = wasmInstance.exports.malloc(4);
  memoryDataView().setUint32(argv_ptr, argv, true);

  wasmInstance.exports.hs_init_with_rtsopts(argcPtr, argv_ptr);

  return function pandoc(args: string, input: string): string {
    const argsPtr = wasmInstance.exports.malloc(args.length);
    new TextEncoder().encodeInto(
      args,
      new Uint8Array(wasmInstance.exports.memory.buffer, argsPtr, args.length)
    );
    inFile.data = new TextEncoder().encode(input);
    wasmInstance.exports.wasm_main(argsPtr, args.length);

    return new TextDecoder('utf-8', { fatal: true }).decode(outFile.data);
  };
}
