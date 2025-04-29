import pandas as pd
import numpy as np 
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt 

data = pd.read_csv('shoplens_temiz_veri.csv')

print(data.head())