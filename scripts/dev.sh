#!/bin/bash
echo "Starting UI services"
echo '--------------------------------------------------'
echo -e

cd ui && npm run dev

echo "Starting backend services"
echo '--------------------------------------------------'
echo -e

cd ../api
source venv/bin/activate
