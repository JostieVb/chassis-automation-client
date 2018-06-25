export const CUSTOM_QUILL_MODULES = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],        // superscript/subscript
        [{ 'align': '' }, { 'align': 'right' }, { 'align': 'center' }, { 'align': 'justify' }],     // text alignment
        [{ 'header': 1 }, { 'header': 2 }],                 // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],       // lists
        ['clean'],                                          // remove formatting button
        ['link', 'image', 'video']                          // link and image, video
    ]
};
