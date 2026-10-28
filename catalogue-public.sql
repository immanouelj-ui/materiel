-- A executer dans SQL Editor APRES avoir importe le CSV dans public.produits.
-- Lecture publique des seuls produits en stock ; aucune ecriture autorisee par ce script.
alter table public.produits enable row level security;

grant usage on schema public to anon, authenticated;
grant select (url, nom, reference, reference_site, marque, ean, description,
  prix_ht, prix_ttc, devise, disponibilite, quantite_disponible, images,
  collecte_utc) on public.produits to anon, authenticated;

drop policy if exists "volt_catalogue_read" on public.produits;
create policy "volt_catalogue_read"
on public.produits for select to anon, authenticated
using (
  disponibilite in ('https://schema.org/InStock','http://schema.org/InStock','InStock')
  and (quantite_disponible is null or quantite_disponible > 0)
);

create index if not exists produits_nom_url_idx on public.produits (nom, url);
create index if not exists produits_prix_url_idx on public.produits (prix_ttc, url);

-- Les autres policies eventuellement presentes restent actives.
-- Une policy permissive existante peut donner un acces plus large : la verifier
-- dans Supabase > Authentication > Policies avant l'ouverture commerciale.
