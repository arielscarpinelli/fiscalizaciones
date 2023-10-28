import json
import os
import csv

by_id = {}
distritos = []
secciones = []

with open('nomenclator.json', "r") as f:
    data = json.loads(f.read())
    for amb in data['amb']:
        if amb['elec'] == 99: # global. todas las elecciones
            for ambito in amb['ambitos']:
                if ambito['l'] == 2:
                    distritos.append([int(ambito['co']),ambito ['n']])
                if ambito['l'] == 4:
                    secciones.append({'distrito': int(ambito['co'][0:2]), 'secc': int(ambito['co'][2:]), 'seccion': ambito['n'] })
                if ambito['l'] == 8:
                    if not ambito['pm'] in by_id:
                        by_id[ambito['pm']] = { 'mesas': [], 'mesas_e': [] }
                    if ambito['co'][-1] == 'E':
                        by_id[ambito['pm']]['mesas_e'].append(ambito['co'][5:10])
                    else:
                        by_id[ambito['pm']]['mesas'].append(ambito['co'][5:10])    
                elif ambito['l'] == 7:
                    if not ambito['i'] in by_id:
                        by_id[ambito['i']] = { 'mesas': [], 'mesas_e': [] }
                    by_id[ambito['i']]['co'] = ambito['co']
                    by_id[ambito['i']]['n'] = ambito['n']

count = 0

with open("../frontend/src/assets/json/secciones.json", "w", encoding='utf-8') as jsonfile:
    jsonfile.write(json.dumps(secciones, indent=4))

with open("secciones.csv", "w", encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['distrito', 'seccion_electoral', 'nombre'])
    for seccion in secciones:
        writer.writerow([seccion['distrito'], seccion['secc'], seccion['seccion']])

with open("escuelas.csv", "w", encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['codigo', 'distrito', 'seccion_electoral', 'circuito', 'nombre', 'min_mesa', 'max_mesa'])

    for escuela in by_id.values():
        mesas = escuela['mesas']
        if len(mesas): # ignoro mesas de extranjeros:
            distrito = int(escuela['co'][0:2])
            seccion = int(escuela['co'][2:5])
            circuito = escuela['co'][5:10]
            mesas_min = int(min(mesas)) if len(mesas) else None
            mesas_max = int(max(mesas)) if len(mesas) else None
        # mesas_e = escuela['mesas_e']
        # mesas_e_min = int(min(mesas_e)) if len(mesas_e) else None
        # mesas_e_max = int(max(mesas_e)) if len(mesas_e) else None
        writer.writerow([escuela['co'][10:], distrito, seccion, circuito, escuela['n'], mesas_min, mesas_max]) # , mesas_e_min, mesas_e_max])
        count = count + 1

print(count)

