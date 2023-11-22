{
  description =
    "An example of a typescript monorepo with nix, kubernetes, and turborepo";

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

        api-deps = pkgs.stdenv.mkDerivation rec {
          name = "api-deps";
          # we have to go 2 directories up to run turbo build
          src = ./.;
          # src = ../..;
          buildInputs = [ node pkgs.nodePackages.pnpm pkgs.turbo ];
          buildPhase = ''
            export HOME=$PWD/.home
            mkdir -p $out/js
            cd $out/js
            cp -r $src/. .

            turbo prune --scope=@mono-ex/api --docker
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

          # fixed-output derivation because pnpm install is impure
          outputHashAlgo = "sha256";
          outputHashMode = "recursive";
          outputHash = "sha256-Om4BcXK76QrExnKcDzw574l+h75C8yK/EbccpbcvLsQ=";
        };

        api-build = pkgs.stdenv.mkDerivation rec {
          name = "api-build";
          # we have to go 2 directories up to run turbo build
          src = ./.;
          # src = ../..;
          buildInputs = [ node pkgs.nodePackages.pnpm pkgs.turbo ];
          buildPhase = ''
            pnpm `
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

        api-image = pkgs.dockerTools.buildImage {
          name = "api-service-docker-image";
          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [ api-build ];
            # pathsToLink = [ "/apps/api" ];

          };
          config = {
            WorkingDir = "/apps/api";
            Cmd = [ "NPM" "run" "start" ];
          };
        };

        devShell = pkgs.devshell.mkShell {
          name = "vestr-devshell";
          commands = [{ package = node; }];
          packages = [ pkgs.nodePackages.pnpm ];
        };

      in {
        packages = {
          api = api-image;
          api-deps = api-deps;
        };
        defaultPackage = api-deps;
        devShells.default = devShell;
      });
}
