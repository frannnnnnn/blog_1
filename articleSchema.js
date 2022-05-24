const mongoose = require("mongoose");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require("marked");

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    sanitizedhtml: {
        type: String,
        required: true
    }

    });
    
articleSchema.pre('validate', function(next){
    if(this.markdown){
        this.sanitizedhtml = DOMPurify.sanitize(marked.parse(this.markdown))
    }
    next()
})

    module.exports = mongoose.model("Article", articleSchema);