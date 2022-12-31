# Exemplos do Phaser 3

Para fazer o download dos exemplos do Phaser 3

https://github.com/photonstorm/phaser3-examples - 821.5 MB

Estes exemplos também estão online

https://phaser.io/examples

É uma quantidade enorme de exemplos, organizados por categoria, que somanm 821 MB compactados

Para usar, descompacte no seu diretório web e renomeie (exemplo) a pasta para phaser3examples.

Acesse a pasta public e remova ou renomeie o arquivo .htaccess

Chame então pelo navegador com

http://localhost/phaser3examples/public/


## Exemplo de como trair um exemplo simples daí.

Acesse pelo gerenciador de arquivos

public/src/physics/arcade/move to.js

Crie as pastas (adapte se for o caso)

c:\xampp\htdocs\exemplos\
c:\xampp\htdocs\exemplos\js\
c:\xampp\htdocs\exemplos\assets\
c:\xampp\htdocs\exemplos\assets\sprites

Acesse a pasta dos exemplos

public/assets/sprites

E copie dela os arquivos block.png e clown.png para a pasta c:\xampp\htdocs\exemplos\assets\sprites

Copie o arquivo move to.js para a pasta

c:\xampp\htdocs\exemplos\js\

Com nome moveto.js

Agora criemos o index.html em

c:\xampp\htdocs\exemplos\index.html

Contendo

```html
<!doctype html> 
<html lang="pt-BR"> 
<head> 
    <meta charset="UTF-8" />
    <title>Esqueleto de um game com Phaser 3</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.11.0/dist/phaser.js"></script>
    <style type="text/css">
        body {
            margin: 0;
        }
    </style>
    <script type="text/javascript" src="js/moveto.js"></script>
</head>
<body>

</body>
</html>
```
Agora mode chamar pelo navegador

http://localhost/exemplos/ que verá o exemplo funcionando. Podemos usar isso para testar o código de algum exemplo que nos interesse.

