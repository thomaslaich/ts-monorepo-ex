{
  description =
    "An example of a typescript monorepo with nix, kubernetes, and turborepo";

  # maybe use a stable version here?
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.devshell.url = "github:numtide/devshell";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };

  outputs = { self, flake-utils, devshell, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;

          overlays = [ devshell.overlays.default ];
        };

        node = pkgs.nodejs_20;

        # container-image = pkgs.dockerTools.buildImage {
        #   
        # }

        # service-app = pkgs.stdenv.mkDerivation {
        #   name = "service-app";
        #   # we have to go 2 directories up to run turbo build
        #   src = ../..;
        #   buildInputs = build-packages ++ [ coursier-cache ];
        #
        #   JAVA_HOME = "${jdk}";
        #   SCALA_CLI_HOME = "./scala-cli-home";
        #   COURSIER_CACHE = "${coursier-cache}/coursier-cache/v1";
        #   COURSIER_ARCHIVE_CACHE = "${coursier-cache}/coursier-cache/arc";
        #   COURSIER_JVM_CACHE = "${coursier-cache}/coursier-cache/jvm";
        #
        #   buildPhase = ''
        #     mkdir scala-cli-home
        #     scala-cli --power \
        #       package . \
        #       --standalone \
        #       --java-home=${jdk} \
        #       --server=false \
        #       -o app 
        #   '';
        #
        #   installPhase = ''
        #     mkdir -p $out/bin
        #     cp app $out/bin
        #   '';
        # };

        # api-server-build = nil;
        #
        # runHook preInstall
        # runHook postInstall
        # chmod +x package

        # The path to the npm project
        src = ../..;

        package = lib.importJSON packageJSON;
        pname = safePkgName package.name;
        version = package.version;

        importYAML = name: yamlFile:
          (lib.importJSON ((pkgs.runCommandNoCC name { } ''
            mkdir -p $out
            ${pkgs.yaml2json}/bin/yaml2json < ${yamlFile} | ${pkgs.jq}/bin/jq -a '.' > $out/pnpmlock.json
          '').outPath + "/pnpmlock.json"));

        # Read the package-lock.json as a Nix attrset
        packageLock = importYAML "${pname}-pnpmlock-${version}" "${src}/pnpm-lock.yaml";

        # Create an array of all (meaningful) dependencies
        deps = builtins.attrValues (removeAttrs packageLock.packages [ "" ])
          ++ builtins.attrValues (removeAttrs packageLock.dependencies [ "" ]);

        # Turn each dependency into a fetchurl call
        tarballs = map (p:
          pkgs.fetchurl {
            url = p.resolved;
            hash = p.integrity;
          }) deps;

        # Write a file with the list of tarballs
        tarballsFile = pkgs.writeTextFile {
          name = "tarballs";
          text = builtins.concatStringsSep "\n" tarballs;
        };

        build-artifacts = pkgs.stdenv.mkDerivation rec {
          name = "build-artifacts";
          # we have to go 2 directories up to run turbo build
          src = ../..;
          # src = ../..;
          buildInputs = [ node pkgs.nodePackages.pnpm pkgs.turbo ];
          buildPhase = ''
            export HOME=$PWD/.home
            export npm_config_cache=$PWD/.npm
            mkdir -p $out/js
            cd $out/js
            cp -r $src/. .

            while read package
            do
              echo "caching $package"
              npm cache add "$package"
            done <${tarballsFile}

            pnpm ci
          '';

          installPhase = ''
            ln -s $out/js/node_modules/.bin $out/bin
          '';
          # buildPhase = ''
          #   pnpm install
          # '';
          # installPhase = ''
          #   mkdir -p "$out/lib/node_modules/${name}"
          #   chmod +x "$out/lib/node_modules/${name}"
          #   cp -r . "$out/lib/node_modules/${name}"
          # '';

          # # fixed-output derivation because pnpm install is impure
          # outputHashAlgo = "sha256";
          # outputHashMode = "recursive";
          # outputHash = "sha256-Om4BcXK76QrExnKcDzw574l+h75C8yK/EbccpbcvLsQ=";
        };

        # build-artifacts = pkgs.stdenv.mkDerivation {
        #   name = "build-artifacts";
        #   # we have to go 2 directories up to run turbo build
        #   src = ../..;
        #   # src = ../..;
        #   buildInputs = [ pkgs.nodePackages.pnpm pkgs.turbo ];
        #   buildPhase = ''
        #     pnpm install
        #   '';
        # };

        # turbo run build --filter=api

        docker-image = pkgs.dockerTools.buildImage {
          name = "api-service-docker-image";
          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [ build-artifacts ];
            # pathsToLink = [ "/apps/api" ];

          };
          config = {
            WorkingDir = "/apps/api";
            Cmd = [ "NPM" "run" "start" ];
          };
        };

        # api-service = pkgs.stdenv.mkDerivation {
        #   name = "api-service";
        #   # we have to go 2 directories up to run turbo build
        #   src = ../..;
        #
        #   buildInputs = [ pkgs.nodePackages.pnpm ];
        #
        #   buildPhase = ''
        #     pnpm install
        #     turbo run build --filter=api
        #   '';
        #
        #   installPhase = pkgs.dockerTools.buildImage {
        #     
        #   }
        #
        # };

        devShell = pkgs.devshell.mkShell {
          name = "vestr-devshell";
          commands = [{ package = node; }];
          packages = [ pkgs.nodePackages.pnpm pkgs.turbo ];
        };

      in {
        devShells.default = devShell;
        packages = { docker = docker-image; };
        defaultPackage = build-artifacts;
        apps = [ ];
      });
}
