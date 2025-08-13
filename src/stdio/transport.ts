import type { Transport, TransportRequest } from "../transport";
import type { ChildProcess } from "node:child_process";
import spawn from "cross-spawn";
import readline from "node:readline";

export interface StdioTransportOptions {
	/**
	 * The executable to run to start the server.
	 */
	command: string;

	/**
	 * Command line arguments to pass to the executable.
	 */
	args?: string[];

	/**
	 * The working directory to use when spawning the process.
	 *
	 * If not specified, the current working directory will be inherited.
	 */
	cwd?: string;
}

export class StdioTransport implements Transport {
	private command: string;
	private args: string[] | null;
	private cwd: string | null;
	private process: ChildProcess | null = null;

	constructor(opts: StdioTransportOptions) {
		this.command = opts.command;
		this.args = opts.args ?? null;
		this.cwd = opts.cwd ?? null;
	}

	public start() {
		this.process = spawn(this.command, this.args ?? [], {
			cwd: this.cwd ?? undefined,
			stdio: ["pipe", "pipe", "inherit"],
		});
	}

	public stop() {
		if (!this.process) {
			return;
		}

		this.process.kill();
		this.process = null;
	}

	public send(request: TransportRequest) {
		if (!this.process || !this.process.stdin) {
			throw new Error("Process not started");
		}

		this.process.stdin.write(request.data + "\n");

		return new Promise<any>((resolve, reject) => {
			const rl = readline.createInterface({
				input: this.process!.stdout!,
			});

			const onLine = (line: string) => {
				try {
					const json = JSON.parse(line);
					resolve({ data: json });
				} catch {
					reject(new Error("Failed to parse response"));
				} finally {
					rl.removeListener("line", onLine);
				}
			};

			rl.on("line", onLine);
		});
	}
}
