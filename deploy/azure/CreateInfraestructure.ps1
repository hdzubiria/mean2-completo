# CREAR BASE DE MONGODB

# Revisar la regiiones disponibles
az appservice list-locations --sku FREE

# Crear el Grupo de Recusros
az group create --name testingMEANApp --location "South Central US"

# Crear la Base de Datos cosmoDB  habitando la conexion de MOMGODB
az cosmosdb create --name cursomean2 --resource-group testingMEANApp --kind MongoDB

# Listar las Claves Disponibles
az cosmosdb keys list --name cursomean2 --resource-group testingMEANApp



# CREAR APP WEB

#crear el plan de servicio
az appservice plan create --name myNodeServicePlan --resource-group testingMEANApp --sku FREE

#Crear la App WEB
az webapp create --resource-group testingMEANApp --plan myNodeServicePlan --name angularNodeAPI

# Cambiar la configiracion para Ejecutar NODE
az webapp config appsettings set --resource-group testingMEANApp --name angularNodeAPI --settings WEBSITE_NODE_DEFAULT_VERSION=10.14.1

#Deploy con ZIP
#https://angularNodeAPI.scm.azurewebsites.net/ZipDeployUI

#Api
#http://angularNodeAPI.azurewebsites.net


#Angular Deploy
#https://angulardeploy.z21.web.core.windows.net/