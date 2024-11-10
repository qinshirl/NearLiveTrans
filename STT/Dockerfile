# Base Image
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3.10 python3.10-distutils python3-pip wget git && \
    rm -rf /var/lib/apt/lists/*

# Install Miniconda (optional if you still want to use Conda for other dependencies)
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    bash Miniconda3-latest-Linux-x86_64.sh -b -p /opt/miniconda && \
    rm Miniconda3-latest-Linux-x86_64.sh

# Update PATH for conda and Python
ENV PATH="/opt/miniconda/bin:$PATH"

# Install Python 3.10 and pip dependencies
RUN conda update -n base -c defaults conda && \
    conda install -n base python=3.10 && \
    conda install -c conda-forge ffmpeg && \
    pip install --upgrade pip

# Install PyTorch, Torchaudio, and CUDA support with pip
RUN pip install -U torch==2.0.0 torchaudio==2.0.0

# Install additional dependencies
RUN pip install --no-cache-dir git+https://github.com/m-bain/whisperx.git

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Set up the working directory and copy application files
WORKDIR /STT
COPY . /STT

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose port
EXPOSE 5001

# Run the application
CMD ["python", "app.py"]
