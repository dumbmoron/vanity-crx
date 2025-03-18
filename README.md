# vanity-crx

a tool for generating vanity CRX ids written in deno

### why?

i was bored and wanted to play around with deno stuff

### usage

options:

```
--threads [n] (optional) - changes the number of threads
for matching, you need to specify at least one of:
    --starts-with <str>
    --ends-with <str>
    --contains <str>
    --regex <regex>
```

```
% deno run start --threads 10 '/^poop/'    
Task start deno run --allow-read=worker.ts,lib.ts main.ts "--threads" "10" "/^poop/"
Running on 10 threads
RegEx: /^poop/
Found extension id: poopghebiomhhmmiihpimfnnahmcnhph
Private key:
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----

% deno run start --threads 32 '/(.)\1{5,}/'
Task start deno run --allow-read=worker.ts,lib.ts main.ts "--threads" "32" "/(.)\1{5,}/"
Running on 32 threads
RegEx: /(.)\1{5,}/
Found extension id: cigaoooooodfhlgmpmdgcjnceeljlhda
Private key:
-----BEGIN PRIVATE KEY-----
.....
-----END PRIVATE KEY-----
```

### caveats

make sure the regex you are passing is satisfiable, otherwise you will be wasting cpu time. chrome
extensions are made up of all lowercase characters from `a` to `q`
