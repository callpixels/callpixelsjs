# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'callpixelsjs/rails/version'

Gem::Specification.new do |spec|
  spec.name          = "callpixelsjs-rails"
  spec.version       = Callpixelsjs::Rails::VERSION
  spec.authors       = ["Blake Hilscher"]
  spec.email         = ["blake@hilscher.ca"]
  spec.summary       = %q{callpixels.js rails wrapper}
  spec.description   = %q{callpixels.js rails wrapper}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files = Dir["{lib,vendor}/**/*"] + ["LICENSE", "README.md"]  
  
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]
  
  spec.add_dependency "railties"
  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake"
end
