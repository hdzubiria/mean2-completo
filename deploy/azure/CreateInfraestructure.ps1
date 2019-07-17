# Revisar la regiiones disponibles
az appservice list-locations --sku FREE

# Crear el Grupo de Recusrsos
az group create --name testingResourceGroup --location "South Central US"

# Crear la Base de Datos cosmoDB  habitando la conexion de MOMGODB
az cosmosdb create --name cursomean2 --resource-group testingResourceGroup --kind MongoDB

# Listar las Claves Disponibles
az cosmosdb keys list --name cursomean2 --resource-group testingResourceGroup



