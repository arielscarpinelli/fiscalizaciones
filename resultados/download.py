import json
import os
import sys

param = sys.argv[1]

with open('nomenclator.json', "r") as f:
    data = json.loads(f.read())
    for amb in data['amb']:
        if amb['elec'] == 99: # global. son las mesas
            for ambito in amb['ambitos']:
                mesa = ambito['co']
                provincia = mesa[:2]
                municipio = mesa[:5]
                if provincia == param and len(mesa) == 11:
                    print("curl 'https://paso.resultados.gob.ar/backend-difu/scope/data/getScopeData/" + mesa + "/1' --compressed -o " + provincia + "/" + municipio + "/" + mesa + "_presidente.json  --create-dirs")

            # for ambito in amb['ambitos']:
            #     mesa = ambito['co']
            #     provincia = mesa[:2]
            #     municipio = mesa[:5]
            #     if len(mesa) == 11:
            #         print("curl 'https://paso.resultados.gob.ar/backend-difu/scope/data/getTiff/" + mesa + "' --compressed -o " + provincia + "/" + municipio + "/" + mesa + "_tiff.json")
