from fastapi import FastAPI
import os

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Temps!"}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
