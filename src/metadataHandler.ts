import { parseFile, IAudioMetadata } from 'music-metadata';

async function parseMetadata(filePath: string): Promise<IAudioMetadata> {
    return parseFile(filePath);
}

export default parseMetadata;