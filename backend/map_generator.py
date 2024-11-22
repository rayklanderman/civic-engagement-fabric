from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/map-coordinates', methods=['GET'])
def get_map_coordinates():
    # Simple coordinates for Kenya counties
    coordinates = {
        "Nairobi": {"lat": -1.2921, "lng": 36.8219},
        "Mombasa": {"lat": -4.0435, "lng": 39.6682},
        "Kisumu": {"lat": -0.1022, "lng": 34.7617}
    }
    return jsonify(coordinates)

if __name__ == '__main__':
    app.run(debug=True, port=5001)