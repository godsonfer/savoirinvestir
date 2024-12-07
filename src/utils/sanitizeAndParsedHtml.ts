import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

export const sanitizeAndParseHTML = (content: string) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
    })
    return parse(sanitizedContent)
}
