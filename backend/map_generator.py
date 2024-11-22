from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/map-coordinates', methods=['GET'])
def get_map_coordinates():
    # Coordinates for all 47 counties in Kenya
    coordinates = {
        "Nairobi": {"lat": -1.2921, "lng": 36.8219},
        "Mombasa": {"lat": -4.0435, "lng": 39.6682},
        "Kisumu": {"lat": -0.1022, "lng": 34.7617},
        "Nakuru": {"lat": -0.3031, "lng": 36.0800},
        "Eldoret": {"lat": 0.5133, "lng": 35.2693},
        "Kisii": {"lat": -0.6769, "lng": 34.7680},
        "Machakos": {"lat": -1.5167, "lng": 37.2833},
        "Kiambu": {"lat": -1.0169, "lng": 36.9667},
        "Bomet": {"lat": -0.9900, "lng": 35.3333},
        "Bungoma": {"lat": 0.5667, "lng": 34.5667},
        "Busia": {"lat": 0.4533, "lng": 34.0833},
        "Elgeyo-Marakwet": {"lat": 1.1000, "lng": 35.1000},
        "Embu": {"lat": -0.5000, "lng": 37.4500},
        "Garissa": {"lat": -0.4594, "lng": 39.6667},
        "Homa Bay": {"lat": -0.5367, "lng": 34.9200},
        "Isiolo": {"lat": 0.3500, "lng": 37.5833},
        "Kajiado": {"lat": -1.7833, "lng": 36.8833},
        "Kakamega": {"lat": 0.2833, "lng": 34.7500},
        "Kericho": {"lat": -0.3667, "lng": 35.2833},
        "Kitui": {"lat": -1.3833, "lng": 38.0000},
        "Kwale": {"lat": -4.2833, "lng": 39.7000},
        "Laikipia": {"lat": -0.2000, "lng": 36.9500},
        "Lamu": {"lat": -2.2700, "lng": 40.9000},
        "Makueni": {"lat": -1.8200, "lng": 37.6700},
        "Mandera": {"lat": 3.9700, "lng": 41.8700},
        "Marsabit": {"lat": 2.3000, "lng": 37.9999},
        "Meru": {"lat": 0.0500, "lng": 37.6500},
        "Migori": {"lat": -1.0667, "lng": 34.4800},
        "Murang'a": {"lat": -0.5500, "lng": 37.2800},
        "Nandi": {"lat": 0.2670, "lng": 35.1010},
        "Narok": {"lat": -1.0833, "lng": 35.8000},
        "Nyamira": {"lat": -0.5500, "lng": 34.9833},
        "Nyandarua": {"lat": -0.8833, "lng": 36.4000},
        "Nyeri": {"lat": -0.4233, "lng": 36.9533},
        "Samburu": {"lat": 1.2400, "lng": 36.5000},
        "Siaya": {"lat": -0.0361, "lng": 34.5889},
        "Taita Taveta": {"lat": -3.4000, "lng": 38.5000},
        "Tana River": {"lat": -2.2049, "lng": 38.2139},
        "Tharaka Nithi": {"lat": -0.6333, "lng": 37.5500},
        "Trans Nzoia": {"lat": 1.0500, "lng": 34.9500},
        "Turkana": {"lat": 3.1500, "lng": 35.2500},
        "Uasin Gishu": {"lat": 0.5186, "lng": 35.2790},
        "Vihiga": {"lat": -0.2000, "lng": 34.6833},
        "Wajir": {"lat": 1.7475, "lng": 40.0672},
        "West Pokot": {"lat": 1.2000, "lng": 35.1000}
    }

    return jsonify(coordinates)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
