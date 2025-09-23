Prompt 1:
```
I want you to initiate repository for following DEMO project: e-shop for cats. 

Toolings:
* Must be webfrontend written in React
* It must be all handled in browser, no backend
* use `vite` 

The respository will serve just for DEMO purposes of Copilot Agent, so I will be adding new features using that. So it must be GitHub Copilot Agent friendly: 
* .github/copilot-instructions.md with general code style, purpose and architecture
* AGENT.md with build/test and other commands

The solution must be working and serving website which will have at least:
* Home page with initial offering of at least 9 products
* Search on top
* Some dummy content like fake phone number, fake email, fake link to facebook and instagram etc.
* It should be possible to put products to baskets and do fake cashout
```

Prompt 2:
```
Do implementation plan first for above
```

Prompt 3:
```
Work now on the implementation, each completion of each task must be tracked in the plan
```

Prompt 4:
```
Now lets use browser_ tools (playwright) to actually test the features that were planned. Fix any issues found and fix any styling issue in the website
```

Prompt 5:
```
I don't see images on all products
```

Prompt 6:
```
I need to setup git repo from this folder, commit anything that needs to be committted, ignore all other files in .gitignore
```