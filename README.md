# Flying Ninja

![Flying ninja!](/examples/_attachments/flying_ninja.png)

Create your own 2D side-scroller game where players maneuver a flying ninja through randomly generated obstacles. Record your high score on the game’s leader board.

- [Overview](#overview)
- [What is Flying Ninja?](#what-is-flying-ninja)
  - [How it works](#how-it-works)
  - [Project structure](#project-structure)
- [What you'll learn](#what-youll-learn)
  - [Onchain randomness](#onchain-randomness)
  - [Onchain frontend](#onchain-frontend)
- [Continue building locally](#continue-building-locally)
- [Learn more](#learn-more)

## Overview

In this example, you will deploy a 2D side-scroller game to the Internet Computer (ICP). This example demonstrates how ICP's unique onchain randomness feature can be used to randomly generate game levels. You will also learn how application frontends are stored directly on the network.

## What is Flying Ninja?

Flying Ninja is a 2D side-scroller game where players interact with the flying ninja character using their keyboard's space bar to move the ninja character up and down. The goal is to avoid the obstacles and obtain points for each obstacle you dodge. When the game ends, the user can add their score to the leader board.

### How it works

The game's logic is written in [Motoko](https://internetcomputer.org/docs/current/motoko/main/getting-started/motoko-introduction),a programming language designed specifically for developing smart contracts on ICP. Smart contracts on ICP are called **canisters.** Motoko strives to be a simple and useful language for ICP canisters that uses a familiar syntax to other languages such as JavaScript, Rust, Swift, or Java.

Every ICP canister must be [compiled into WebAssembly](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/compile) before it can be deployed. Motoko's compiler supports compiling to Wasm directly under the hood. It offers seamless integration for ICP features and makes the most out of WebAssembly's functionalities.

### Project structure

The `/backend` folder contains the Motoko canister, `main.mo`.

The `/frontend` folder contains web assets for the application's user interface. The user interface is written using the React framework.

Edit the `mops.toml` file to add [Motoko dependencies](https://mops.one/) to the project.

## What you'll learn

### Onchain randomness

ICP uses a verifiable random function to generate [randomness onchain](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/advanced-features/randomness). During each [execution round](https://internetcomputer.org/how-it-works/execution-layer/), the verifiable random function is evaluated, using the number of the current round as the input for the function.

Each evaluation produces a new set of random bytes, which become the seed for random tape. The random tape feature uses ICP's [chain-key cryptography](https://internetcomputer.org/how-it-works/chain-key-technology) to return random values to each canister that has requested randomness in the previous execution round.

To use randomness in Motoko canisters, the Motoko [Random](https://internetcomputer.org/docs/current/motoko/main/writing-motoko/randomness) library can be used.

### Onchain frontend

ICP is the only blockchain that can serve web assets (HTML, CSS, JS, and others) from the blockchain to your web browser. To host these assets, a canister implements a method that accepts and consumes an HTTP request, then returns the web assets in the HTTP response.

In this example, the React frontend is compiled into an [asset canister canister](https://internetcomputer.org/docs/current/developer-docs/web-apps/application-frontends/overview) and deployed to ICP.

To communicate with the backend canister, it uses the [ICP JavaScript agent](https://internetcomputer.org/docs/current/developer-docs/developer-tools/off-chain/agents/javascript-agent).

## Continue building with locally

To migrate your ICP Ninja project off of the web browser and develop it locally, follow these steps.

### 1. Download your project from ICP Ninja using the 'Download files' button.

![ICP Ninja download](/examples/_attachments/icp_ninja_download_files.png)

### 2. Open the `BUILD.md` file for further instructions.

The `BUILD.md` file included in your download will provide information about using `dfx`.

## Learn more

- [Motoko documentation](https://internetcomputer.org/docs/current/motoko/main/getting-started/motoko-introduction)
- [ICP development workflow](https://internetcomputer.org/docs/current/developer-docs/getting-started/development-workflow)
- [Inside canisters](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/overview/inside-canisters)
- [Canister lifecycle](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/overview/canister-lifecycle)
- [Application frontends](https://internetcomputer.org/docs/current/developer-docs/web-apps/application-frontends/overview)
- [React quickstart](https://internetcomputer.org/docs/current/developer-docs/getting-started/quickstart/react-quickstart)
