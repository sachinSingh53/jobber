import { getDoccumentById } from "../elasticsearch.js";


export async function gigById(indexName,gigId){
    const gig = await getDoccumentById(indexName,gigId);
    return gig;
}