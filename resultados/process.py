import json
import os
import sys
import csv

partidos = {
    "132": "jxc",
    "133": "schiaretti",
    "134": "uxp",
    "135": "lla",
    "136": "izq"
}
listas = {
    "01003007": "larreta"
}

def process_file(filepath, tipo, row = {}):
    print(filepath)
    if not os.path.isfile(filepath):
        return row
    with open(filepath, "r") as f:
        data = json.loads(f.read())
        if not data:
            return {}
        row['cod_municipio'] = data['id']['idAmbito']['codigo'][2:5]
        row['municipio'] = data['fathers'][3]['name']
        row['circuito'] = data['fathers'][0]['codigo'][5:10]
        row['cod_escuela'] = data['fathers'][0]['codigo'][10:]
        row['escuela'] = data['fathers'][0]['name']
        row['mesa'] = int(data['id']['idAmbito']['codigo'][5:10])
        # row['mesa_tipo'] = data['id']['idAmbito']['codigo'][10]
        row[tipo + '_electores'] = int(data['electores'])
        row[tipo + '_blancos'] = int(data['blancos'])
        row[tipo + '_votos_afirmativos'] = int(data['afirmativos'])
        otros = 0
        for partido in data['partidos']:
            if partido['codTel'] in partidos:
                row[tipo + '_' + partidos[partido['codTel']]] = int(partido['votos'])
            else:
                otros += int(partido['votos'])
            if tipo == "paso":
                for lista in partido['listas']:
                    if lista['code'] in listas:
                        row[tipo + '_' + listas[lista['code']]] = int(lista['votos'])
        row[tipo + '_otros'] = otros
    return row


cuentas = [ '_electores', '_blancos', '_votos_afirmativos', '_jxc', '_schiaretti', '_uxp', '_lla', '_izq', '_otros' ]

fieldnames = ['cod_municipio', 'municipio', 'circuito', 'cod_escuela', 'escuela', 'mesa', 'paso_larreta'] + [tipo + cuenta for cuenta in cuentas for tipo in ['paso', 'generales', 'diff']]


param = sys.argv[1]

(_, dirs, _) = next(os.walk(param))

with open(param + ".csv", "w", encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for dir in dirs:
        for filename in os.listdir(param + "/" + dir):
            if not 'E' in filename: # ignorar mesas de extranjeros
                row = process_file(param + "/" + dir + "/" + filename, 'paso')
                row = process_file('../resultadosgenerales/' + param + "/" + dir + "/" + filename, 'generales', row)
                for cuenta in cuentas: 
                    if ('paso' + cuenta) in row and ('generales' + cuenta) in row and row['generales' + cuenta] > 0 and row['paso' + cuenta] > 0:
                        row['diff' + cuenta] = row['generales' + cuenta] - row['paso' + cuenta]
                if 'mesa' in row:
                    writer.writerow(row)    
