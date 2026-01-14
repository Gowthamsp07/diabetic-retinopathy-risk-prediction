"""
Utility functions for data preprocessing
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def load_and_preprocess_data(filepath):
    """
    Load and preprocess diabetic retinopathy dataset
    
    Args:
        filepath (str): Path to CSV file
    
    Returns:
        tuple: (X_scaled, y, scaler, feature_names)
    """
    # Load data
    df = pd.read_csv(filepath)
    
    # Separate features and target
    X = df.drop('diagnosis', axis=1)
    y = df['diagnosis']
    
    # Get feature names
    feature_names = X.columns.tolist()
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X_scaled, y, scaler, feature_names

def prepare_single_sample(patient_data, scaler, feature_names):
    """
    Prepare a single patient sample for prediction
    
    Args:
        patient_data (dict): Patient features
        scaler (StandardScaler): Fitted scaler
        feature_names (list): Expected feature names
    
    Returns:
        np.array: Scaled features for prediction
    """
    # Create array in correct order
    features = []
    for feature in feature_names:
        if feature in patient_data:
            features.append(float(patient_data[feature]))
        else:
            raise ValueError(f"Missing feature: {feature}")
    
    # Convert to array and scale
    features_array = np.array([features])
    features_scaled = scaler.transform(features_array)
    
    return features_scaled