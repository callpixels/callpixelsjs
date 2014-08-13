module Callpixelsjs
  class Compile
    
    class << self
      def perform
        Dir.chdir(root) do |f|
          # compile src
          system("grunt")
          output = 'vendor/assets/javascripts/'
          FileUtils.rm_rf(output)
          FileUtils.mkdir_p(output)
          Dir.glob('dist/*.js'){|f| FileUtils.cp( f, output ) }
          # generate jsdocs
          system("./node_modules/.bin/jsdoc -c config/jsdocs.json")
        end
      end
      
      def root
        File.expand_path(File.join(__FILE__, '../../../'))
      end
    end
    
  end
end
