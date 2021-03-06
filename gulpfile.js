var gulp = require('gulp');
var path = require('path');
var combiner = require('stream-combiner2');
var runSequence = require('run-sequence');
var del = require('del');
var jsonminify = require('gulp-jsonminify');
var prettify = require('gulp-jsbeautifier');
var generateJSONSchema = require('./src/generate-json-schema.js');
var generateJSONExample = require('./src/generate-json-example.js');
var minimist = require('minimist');
var assert = require('assert');
var exec   =  require('child_process').exec;


var knownOptions = {
  string: ['inputExcelFile', 'sheetName', 'outputDir', 'versionSchema'],
  default: {
    inputExcelFile: 'example/sample.xlsx',
    sheetName: 'Schema',
    outputDir: 'dist',
    versionSchema: 'http://json-schema.org/draft-07/schema#'
  }
};

var jsonLogPrettify = function(text, obj) {
  console.log();
  console.log(text);
  console.log("=".repeat(text.length));
  console.log(JSON.stringify(obj, null, 4));
  console.log();
}

var args = minimist(process.argv.slice(2), knownOptions)

gulp.task('clean', function () {
  del('./lib');
  return del('./dist');
})

gulp.task('schema', function (done) {
  jsonLogPrettify("Output schema information", args);
  assert(args.inputExcelFile, 'Please provide Input Excel Sheet location');
  assert(args.sheetName, 'Please provide Sheet Name');
  assert(args.outputDir, 'Please provide Output dir location');
  assert(args.versionSchema, 'Please provide Json-Schema version');
  generateJSONSchema(path.join(__dirname, args.inputExcelFile), args.sheetName, path.join(__dirname, args.outputDir), false, args.versionSchema);
  done();
});

gulp.task('example', function (done) {
  jsonLogPrettify("Output json  information", args);
  assert(args.inputExcelFile, 'Please provide Input Excel Sheet location');
  assert(args.sheetName, 'Please provide Sheet Name');
  assert(args.outputDir, 'Please provide Output dir location');
  generateJSONExample(path.join(__dirname, args.inputExcelFile), args.sheetName, path.join(__dirname, args.outputDir));
  done();
});

gulp.task('test', function(done) {
  var shellCommand = exec('npm run-script test');
  
  shellCommand.stdout.pipe(process.stdout);
  done();
});

gulp.task('build', function(done) {
  var shellCommand = exec('npm run-script build');
  
  shellCommand.stdout.pipe(process.stdout);
  done();
});

gulp.task('version', function(done) {
  var shellCommand = exec('npm run-script version');
  
  shellCommand.stdout.pipe(process.stdout);
  done();
});

gulp.task('x', function(done) {
  var shellCommand = exec('npm run-script x');
  
  shellCommand.stdout.pipe(process.stdout);
  done();
});

gulp.task('lint', function () {
  var combined = combiner.obj([
    gulp.src(['./dist/*.json']),
    jsonminify(),
    prettify(),
    gulp.dest(args.outputDir)
  ])
  combined.on('error', console.error.bind(console))
  return combined
})

gulp.task('default', function task (done) {
  runSequence('clean', 'generate-json-schema', 'lint', done)
})
