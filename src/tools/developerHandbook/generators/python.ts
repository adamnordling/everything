import type { GeneratedFile, ScaffolderState } from '../types';

export function generatePythonFiles(state: ScaffolderState): GeneratedFile[] {
    // GUARD: Never generate Python files if Python is not chosen
    if (!state.languages.includes('python')) {
        return [];
    }

    const files: GeneratedFile[] = [];
    const isMl = state.archetype === 'python-ml';

    files.push({
        path: 'pyproject.toml',
        description: 'PEP 621 Python dependencies & uv packaging declaration',
        badge: 'TOML',
        content: `[project]
name = "${state.projectName}"
version = "0.1.0"
description = "Python ${isMl ? 'Machine Learning pipeline' : 'service'}"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "pydantic>=2.10.0",
    ${isMl ? '"torch>=2.5.0",\n    "numpy>=2.0.0",\n    "httpx>=0.28.0",\n    ' : ''}${state.framework.includes('fastapi') ? '"fastapi>=0.115.0",\n    "uvicorn[standard]>=0.32.0"' : ''}
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]`
    });

    files.push({
        path: 'ruff.toml',
        description: 'Ruff linter and code formatter rules',
        badge: 'TOML',
        content: `line-length = 100
indent-width = 4
target-version = "py311"

[lint]
select = ["E4", "E7", "E9", "F", "I", "B", "C4", "UP"]
fixable = ["ALL"]`
    });

    files.push({
        path: 'src/main.py',
        description: 'Python main execution script',
        badge: 'Python',
        content: state.framework.includes('fastapi')
            ? `from fastapi import FastAPI

app = FastAPI(title="${state.projectName}")

@app.get("/health")
def health():
    return {"status": "online", "service": "${state.projectName}"}`
            : `def main() -> None:
    print("${state.projectName} initialized.")

if __name__ == "__main__":
    main()`
    });

    return files;
}
