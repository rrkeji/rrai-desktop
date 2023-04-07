
export type CodeBlock = { type: 'code'; content: string; language: string | null; complete: boolean; code: string; };



export const inferCodeLanguage = (markdownLanguage: string, code: string): string | null => {
    // we have an hint
    if (markdownLanguage) {
        // no dot: assume is the syntax-highlight name
        if (!markdownLanguage.includes('.'))
            return markdownLanguage;

        // dot: there's probably a file extension
        const extension = markdownLanguage.split('.').pop();
        if (extension) {
            const languageMap: { [key: string]: string } = {
                cs: 'csharp', html: 'html', java: 'java', js: 'javascript', json: 'json', jsx: 'javascript',
                md: 'markdown', py: 'python', sh: 'bash', ts: 'typescript', tsx: 'typescript', xml: 'xml',
            };
            const language = languageMap[extension];
            if (language)
                return language;
        }
    }

    // based on how the code starts, return the language
    if (code.startsWith('<DOCTYPE html') || code.startsWith('<!DOCTYPE')) return 'html';
    if (code.startsWith('<')) return 'xml';
    if (code.startsWith('from ')) return 'python';
    if (code.startsWith('import ') || code.startsWith('export ')) return 'typescript'; // or python
    if (code.startsWith('interface ') || code.startsWith('function ')) return 'typescript'; // ambiguous
    if (code.startsWith('package ')) return 'java';
    if (code.startsWith('using ')) return 'csharp';
    return null;
};