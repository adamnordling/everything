import type { GeneratedFile, ScaffolderState } from '../types';

export function generateSystemsFiles(state: ScaffolderState): GeneratedFile[] {
    const hasRust = state.languages.includes('rust');
    const hasGo = state.languages.includes('go');

    // GUARD: Never generate Rust/Go files if neither language is selected
    if (!hasRust && !hasGo) {
        return [];
    }

    const files: GeneratedFile[] = [];

    if (hasRust && state.archetype !== 'desktop-tauri') {
        files.push({
            path: 'Cargo.toml',
            description: 'Rust Cargo manifest with release LTO optimization',
            badge: 'TOML',
            content: `[package]
name = "${state.projectName}"
version = "0.1.0"
edition = "2021"

[dependencies]
clap = { version = "4.5", features = ["derive"] }
tokio = { version = "1.40", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
anyhow = "1.0"

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true`
        });

        files.push({
            path: 'src/main.rs',
            description: 'Rust binary entrypoint with Clap arguments',
            badge: 'Rust',
            content: `use anyhow::Result;
use clap::Parser;

#[derive(Parser, Debug)]
#[command(name = "${state.projectName}", version = "0.1.0")]
struct Args {
    #[arg(short, long)]
    verbose: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let _args = Args::parse();
    println!("${state.projectName} online.");
    Ok(())
}`
        });
    }

    if (hasGo) {
        files.push({
            path: 'go.mod',
            description: 'Go module declaration',
            badge: 'Go',
            content: `module ${state.projectName}\n\ngo 1.23\n`
        });

        files.push({
            path: 'main.go',
            description: 'Go main entrypoint',
            badge: 'Go',
            content: `package main

import "fmt"

func main() {
    fmt.Println("${state.projectName} initialized.")
}`
        });
    }

    return files;
}
