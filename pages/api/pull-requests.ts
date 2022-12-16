// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const ADO_AUTH_TOKEN = process.env.ADO_AUTH_TOKEN as string;
const ADO_ORG = process.env.ADO_ORG as string;

if(ADO_AUTH_TOKEN.length === 0) throw Error('ADO_AUTH_TOKEN is not defined as an env var');
if(ADO_ORG.length === 0) throw Error('ADO_ORG is not defined as an env var');

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try{
        /**
         * Query params
         * $top=20 - get first 20 results
         * searchCriteria.status=all - gets PRs in all statuses (by default only gets active PRs) 
         */
        const url = `https://dev.azure.com/${ADO_ORG}/ProjOne/_apis/git/repositories/RepoOne/pullrequests?api-version=7.0`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + ADO_AUTH_TOKEN
            }
        });

        const data: any = await response.json();

        // if non ok response
        if(response.status >= 400) {
            return res.status(response.status).send({message: 'unable to get data from ADO'});
        }

        // happy case
        return res.status(response.status).json(data);

    }catch(e){
        console.error(e);
        return res.status(500).send({message: 'unexpected server error'});
    } 
}
