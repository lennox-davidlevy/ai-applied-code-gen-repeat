#!/bin/bash

copy_with_confirmation() {
    local source_file=$1
    local target_file=$2

    if [ -f "$target_file" ]; then
        read -p "$target_file exists. Do you want to overwrite it? (y/n) " choice
        case "$choice" in
            y|Y ) echo "Copying $source_file to $target_file..."
                  cp "$source_file" "$target_file"
                  echo "Successfully copied $source_file to $target_file."
                  echo '--------------------------------------------------'
                  echo -e
                  ;;
            * ) echo "Skipping $target_file."
                ;;
        esac
    else
        echo "Copying $source_file to $target_file..."
        cp "$source_file" "$target_file"
        echo "Successfully copied $source_file to $target_file."
        echo '--------------------------------------------------'
        echo -e
    fi
}

# Copying .env.example to .env in both client and server directories
copy_with_confirmation "ui/client/.env.example" "ui/client/.env"
copy_with_confirmation "ui/server/.env.example" "ui/server/.env"

echo "Installing ui dependencies."
echo '--------------------------------------------------'
echo -e

cd ui && npm run setup
