import { openDB } from 'idb';
export type Lesson={id:string,title:string,subject:string,createdAt:number,updatedAt:number,topic:string,level:string,language:string,steps:any[],messages:any[],checkpointResults:any[],currentStep:number};
const dbPromise=openDB('brightboard-db',1,{upgrade(db){db.createObjectStore('lessons',{keyPath:'id'});db.createObjectStore('notes',{keyPath:'id'});}});
export async function saveLesson(x:Lesson){const db=await dbPromise;await db.put('lessons',x)}
export async function getLessons():Promise<Lesson[]>{const db=await dbPromise;return (await db.getAll('lessons')).sort((a,b)=>b.updatedAt-a.updatedAt)}
export async function deleteLesson(id:string){const db=await dbPromise;await db.delete('lessons',id)}
export async function saveNote(x:any){const db=await dbPromise;await db.put('notes',x)}
export async function getNotes(){const db=await dbPromise;return db.getAll('notes')}
