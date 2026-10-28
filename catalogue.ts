export type Product = {url:string; nom:string; reference:string; reference_site:string; marque:string; ean?:string; description:string; prix_ht:number|null; prix_ttc:number|null; devise?:string; disponibilite:string; quantite_disponible:number|null; images:string|string[]; collecte_utc?:string};
export const categories = [
  {id:'all', name:'Tout le catalogue', term:''},
  {id:'protection', name:'Tableau & protection', term:'disjoncteur'},
  {id:'appareillage', name:'Prises & interrupteurs', term:'prise'},
  {id:'eclairage', name:'Éclairage', term:'LED'},
  {id:'cable', name:'Câbles & connexions', term:'câble'},
  {id:'domotique', name:'Domotique', term:'connecté'}
];
export function imagesOf(p:Product):string[]{const values=Array.isArray(p.images)?p.images:String(p.images||'').split('|');return values.map(x=>x.trim()).filter(x=>/^https:\/\//i.test(x)||x.startsWith('/'));}
export function sellable(p:Product){ return /(?:^|\/)InStock\/?$/.test(p.disponibilite||'') && (p.quantite_disponible===null||p.quantite_disponible>0); }
export const demoProducts:Product[] = [
  ['demo-1','Disjoncteur modulaire 20 A','Protection','DX-20','Tableau & protection',18.9,15.75,128,'breaker'],
  ['demo-2','Prise de courant, finition graphite','Appareillage','PC-GR','Prises & interrupteurs',12.5,10.42,64,'socket'],
  ['demo-3','Interrupteur simple, blanc mat','Appareillage','INT-BM','Prises & interrupteurs',8.9,7.42,215,'switch'],
  ['demo-4','Spot LED encastrable 7 W','Éclairage','LED-07','Éclairage',24.9,20.75,42,'spot'],
  ['demo-5','Câble électrique 3G 2,5 mm²','Câblage','CB-325','Câbles & connexions',89,74.17,36,'cable'],
  ['demo-6','Commande connectée, finition sable','Domotique','CMD-01','Domotique',49.9,41.58,18,'switch'],
  ['demo-7','Disjoncteur différentiel 30 mA','Protection','DF-30','Tableau & protection',79.9,66.58,51,'breaker'],
  ['demo-8','Prise double, blanc mat','Appareillage','PC-DB','Prises & interrupteurs',21.9,18.25,82,'socket']
].map(([id,nom,marque,ref,cat,ttc,ht,stock,image])=>({url:String(id),nom:String(nom),reference:String(ref),reference_site:String(ref),marque:String(marque),description:`${nom}. Fiche illustrative pour découvrir la boutique. Les caractéristiques, prix et quantités sont des exemples ; ils seront remplacés par votre catalogue Supabase. Famille : ${cat}.`,prix_ttc:Number(ttc),prix_ht:Number(ht),quantite_disponible:Number(stock),disponibilite:'https://schema.org/InStock',images:[`/products/${image}.svg`]}));
