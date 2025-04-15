all: install build

install:
	npm ci

build:
	npm run build
	@echo "Build completed."

start:
	npm run start

dev:
	npm run dev

prettier:
	npx prettier --write .

migrate:
	npm run knex:migrate-dev

migrate-prod:
	npm run knex:migrate-prod

seed:
	npm run knex:seed

.PHONY: install build