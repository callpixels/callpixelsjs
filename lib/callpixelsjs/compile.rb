require "callpixelsjs/rails/version"

module Callpixelsjs
  class Compile
    
    class << self
      def perform
        Dir.chdir(root) do |f|
          %x{./node_modules/.bin/jsdoc -c config/jsdocs.json}
          %x{grunt}
          FileUtils.rm_rf('vendor')
          FileUtils.mkdir_p('vendor/assets/javascripts/', )
          Dir.glob('dist/*.js'){|f| FileUtils.cp( f, 'vendor/assets/javascripts/') }
        end
      end
      def root
        File.expand_path(File.join(__FILE__, '../../../'))
      end
    end
    
  end
end
