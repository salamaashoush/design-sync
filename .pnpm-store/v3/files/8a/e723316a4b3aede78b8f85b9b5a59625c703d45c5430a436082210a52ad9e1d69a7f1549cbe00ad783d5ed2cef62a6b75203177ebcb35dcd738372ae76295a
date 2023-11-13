import { Profiler } from 'node:inspector';
import { BaseCoverageProvider } from 'vitest/coverage';
import { CoverageProvider, AfterSuiteRunMeta, ReportContext, ResolvedCoverageOptions } from 'vitest';
import { Vitest } from 'vitest/node';

interface TestExclude {
    new (opts: {
        cwd?: string | string[];
        include?: string | string[];
        exclude?: string | string[];
        extension?: string | string[];
        excludeNodeModules?: boolean;
        relativePath?: boolean;
    }): {
        shouldInstrument(filePath: string): boolean;
        glob(cwd: string): Promise<string[]>;
    };
}
type Options = ResolvedCoverageOptions<'v8'>;
declare class V8CoverageProvider extends BaseCoverageProvider implements CoverageProvider {
    name: string;
    ctx: Vitest;
    options: Options;
    testExclude: InstanceType<TestExclude>;
    coverages: Profiler.TakePreciseCoverageReturnType[];
    initialize(ctx: Vitest): void;
    resolveOptions(): Options;
    clean(clean?: boolean): Promise<void>;
    onAfterSuiteRun({ coverage }: AfterSuiteRunMeta): void;
    reportCoverage({ allTestsRun }?: ReportContext): Promise<void>;
    private getUntestedFiles;
    private getSources;
}

export { V8CoverageProvider };
