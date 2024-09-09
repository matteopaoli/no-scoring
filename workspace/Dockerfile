# Dockerfile
FROM ubuntu:24.04

# Install necessary packages
RUN apt-get update && apt-get install -y \
    curl \
    git \
    vim \
    build-essential \
    nodejs \
    npm \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Add a non-root user and give it sudo access
ARG USERNAME=devuser
ARG USER_UID=1000
ARG USER_GID=1000

# Create the group and user if they don't already exist
RUN groupadd --gid $USER_GID $USERNAME || true \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME || true \
    && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set the working directory
WORKDIR /workspace

# Switch to the new user
USER $USERNAME

# Optional: Copy files into the container
# COPY . /workspace

# Start a shell by default
CMD ["/bin/bash"]
