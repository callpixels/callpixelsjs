require "bundler/gem_tasks"
require 'fileutils'

task :before_build do
  %x{grunt}
  FileUtils.rm_rf('vendor')
  FileUtils.mkdir_p('vendor/assets/javascripts/', )
  Dir.glob('dist/*.js'){|f| FileUtils.cp( f, 'vendor/assets/javascripts/') }
end

task :build => :before_build