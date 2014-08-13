require "bundler/gem_tasks"
require 'fileutils'

namespace :jsdocs do
  desc "compile jsdocs"
  task :compile do
    %x{./node_modules/.bin/jsdoc -c config/jsdocs.json}
  end
end

namespace :grunt do
  desc "compile src js files"
  task :compile do
    %x{grunt}
    FileUtils.rm_rf('vendor')
    FileUtils.mkdir_p('vendor/assets/javascripts/', )
    Dir.glob('dist/*.js'){|f| FileUtils.cp( f, 'vendor/assets/javascripts/') }
  end
end

task :before_build do
  Rake::Task["grunt:compile"].execute
  Rake::Task["jsdocs:compile"].execute
end

task :build => :before_build