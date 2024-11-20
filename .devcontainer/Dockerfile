FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Setup support for Git LFS
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash &&\
    sudo apt-get install git-lfs

# Install additionally Expo CLI and EAS (Expo Application Services)
RUN npm install -g expo-cli eas-cli

CMD ["bash"]
