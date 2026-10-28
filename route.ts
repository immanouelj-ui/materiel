import { NextRequest, NextResponse } from 'next/server';
import {categories,demoProducts,sellable} from '@/lib/catalogue';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  const query=request.nextUrl.searchParams;
  const search=(query.get('q')||'').trim().slice(0,120);
  const category=categories.find(c=>c.id===query.get('category'))||categories[0];
  const sort=query.get('sort')||'default';
  const page=Math.max(1,Math.min(100000,parseInt(query.get('page')||'1')||1));
  const limit=12;
  const origin=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!origin&&!key){
    const normalized=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const rows=demoProducts.filter(p=>sellable(p)&&(!search||normalized(`${p.nom} ${p.reference} ${p.marque}`).includes(normalized(search)))&&(!category.term||normalized(`${p.nom} ${p.description}`).includes(normalized(category.term))));
    if(sort==='price-asc')rows.sort((a,b)=>(a.prix_ttc??Infinity)-(b.prix_ttc??Infinity));
    if(sort==='price-desc')rows.sort((a,b)=>(b.prix_ttc??-Infinity)-(a.prix_ttc??-Infinity));
    if(sort==='default')rows.sort((a,b)=>a.nom.localeCompare(b.nom,'fr'));
    return NextResponse.json({products:rows.slice((page-1)*limit,page*limit),total:rows.length,demo:true,page});
  }
  if(!origin||!key)return NextResponse.json({error:'Configuration Supabase incomplète.'},{status:503});
  try{
    const api=new URL('/rest/v1/produits',origin);
    api.searchParams.set('select','url,nom,reference,reference_site,marque,ean,description,prix_ht,prix_ttc,devise,disponibilite,quantite_disponible,images,collecte_utc');
    api.searchParams.set('disponibilite','in.("https://schema.org/InStock","http://schema.org/InStock","InStock")');
    // Quoted filter operands prevent user text from becoming PostgREST syntax.
    const literal=(value:string)=>'"*'+value.replace(/[\\"*%_]/g,' ').trim()+'*"';
    const conditions=['or(quantite_disponible.gt.0,quantite_disponible.is.null)'];
    if(search)conditions.push(`or(nom.ilike.${literal(search)},reference.ilike.${literal(search)},reference_site.ilike.${literal(search)},marque.ilike.${literal(search)})`);
    if(category.term)conditions.push(`nom.ilike.${literal(category.term)}`);
    api.searchParams.set('and','('+conditions.join(',')+')');
    api.searchParams.set('order',sort==='price-asc'?'prix_ttc.asc.nullslast,url.asc':sort==='price-desc'?'prix_ttc.desc.nullslast,url.asc':'nom.asc,url.asc');
    api.searchParams.set('limit',String(limit));api.searchParams.set('offset',String((page-1)*limit));
    const response=await fetch(api,{headers:{apikey:key,...(key.startsWith('eyJ')?{Authorization:`Bearer ${key}`} : {}),Prefer:'count=exact'},cache:'no-store',signal:AbortSignal.timeout(12000)});
    if(!response.ok){console.error('Supabase catalogue HTTP',response.status);return NextResponse.json({error:'Catalogue indisponible. Vérifiez la configuration Supabase, les colonnes et la règle de lecture.'},{status:502});}
    const products=await response.json();
    return NextResponse.json({products,total:Number(response.headers.get('content-range')?.split('/')[1])||0,demo:false,page});
  }catch{return NextResponse.json({error:'Impossible de joindre le catalogue. Réessayez dans un instant.'},{status:502});}
}
