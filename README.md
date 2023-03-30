# contagem-alfanumerica
Objetivos iniciais:
1 - realizar a contagem(soma) de valores alfanuméricos (0 - Z)
<br>
2 - possibilitar a criação randomica de chaves de identificação.
<br>
3 - traduzir valores alfanuméricos para valores decimais.

______________________________________________________________

Para alcançar os objetivos, vislumbram-se trÊs métodos principais que serão responsáveis por fornecer as funcionalidades acima citadas.

O primeiro método recebe um valor alfanumérico e acrescenta 1 a ele, por padrão, mas caso seja fornecido um valor alternativo, nos parâmetros do método, realiza a soma desse valor. O método pode também receber um callback para ser retornado caso a operação seja bem sucedida. Objetiva-se, no futuro, possibilitar diversas operações matemáticas com os valores alfanuméricos.

Para o segundo método poderam ser informados: o valor de algarismos do identificador, um array com os valores já existentes e um callback que será retornado no casso de sucesso.

Para o terceiro método, vislumbram-se duas etapas. Na primeira etapa, ele receberá um valor alfanumérico e retornará o valor respectivo em decimal. Na segunda etapa o método recebera o formato para a 'tradução', podendo ser decimal (10) ou hexadecimal (16) e o valor alfanumérico, retornando o resultado do formato especificado.

todos os métodos em caso de erro retornarão false. Caso ocorra tudo certo retornam, no primeiro e segundo método, um array com o valor esperado e o callback, no terceiro método, retorna apenas o valor esperado. No primeiro e segundo método, caso não seja informado um callback, por padrão a função retornada (no lugar deste callback) é o método de tradução (o terceiro método aqui citado).
