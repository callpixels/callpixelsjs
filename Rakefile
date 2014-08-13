require "bundler/gem_tasks"
require 'fileutils'
require_relative 'lib/callpixelsjs/compile.rb'

namespace :callpixelsjs do
  desc "compile callpixelsjs"
  task :compile do
    Callpixelsjs::Compile.perform
  end
end

task :before_build do
  Rake::Task["callpixelsjs:compile"].execute
end

task :build => :before_build