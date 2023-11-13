"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtsCreator = void 0;
const process = __importStar(require("process"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const file_system_loader_1 = __importDefault(require("./file-system-loader"));
const dts_content_1 = require("./dts-content");
class DtsCreator {
    constructor(options) {
        if (!options)
            options = {};
        this.rootDir = options.rootDir || process.cwd();
        this.searchDir = options.searchDir || '';
        this.outDir = options.outDir || this.searchDir;
        this.loader = new file_system_loader_1.default(this.rootDir, options.loaderPlugins);
        this.inputDirectory = path.join(this.rootDir, this.searchDir);
        this.outputDirectory = path.join(this.rootDir, this.outDir);
        this.camelCase = options.camelCase;
        this.namedExports = !!options.namedExports;
        this.dropExtension = !!options.dropExtension;
        this.EOL = options.EOL || os.EOL;
    }
    async create(filePath, initialContents, clearCache = false) {
        let rInputPath;
        if (path.isAbsolute(filePath)) {
            rInputPath = path.relative(this.inputDirectory, filePath);
        }
        else {
            rInputPath = path.relative(this.inputDirectory, path.join(process.cwd(), filePath));
        }
        if (clearCache) {
            this.loader.tokensByFile = {};
        }
        const res = await this.loader.fetch(filePath, '/', undefined, initialContents);
        if (res) {
            const tokens = res;
            const keys = Object.keys(tokens);
            const content = new dts_content_1.DtsContent({
                dropExtension: this.dropExtension,
                rootDir: this.rootDir,
                searchDir: this.searchDir,
                outDir: this.outDir,
                rInputPath,
                rawTokenList: keys,
                namedExports: this.namedExports,
                camelCase: this.camelCase,
                EOL: this.EOL,
            });
            return content;
        }
        else {
            throw res;
        }
    }
}
exports.DtsCreator = DtsCreator;
//# sourceMappingURL=dts-creator.js.map