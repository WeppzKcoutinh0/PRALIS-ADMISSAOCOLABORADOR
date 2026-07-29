-- Necessario para o indice de busca por nome (ilike / trigram)
create extension if not exists pg_trgm with schema public;
