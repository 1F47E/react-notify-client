import { Prism } from '@mantine/prism';

// get the url of the websocket server from vercel envs
// NEXT_PUPLIC prefix is required for vercel to expose the env
const publishUrl = process.env.NEXT_PUBLIC_PUBLISH_SERVER_URL as string;

const demoCode = `curl -X POST '${publishUrl}'  -H 'Content-Type: application/json' -H 'channel: demo' -d '{"text":"hello", "type":"info"}'`;

export default function HowTo() {
    return <Prism
        language="bash"
        trim={true}
        radius='lg'
    >{demoCode}</Prism>;
}