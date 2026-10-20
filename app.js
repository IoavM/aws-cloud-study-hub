/**
 * AWS CLOUD STUDY HUB - APPLICATION LOGIC & COMPLETE OFFICIAL LAB KNOWLEDGE BASE
 * Desglose pasito a pasito, 100% fiel a las guías oficiales:
 * - Lab Evolutivo 05: Seguridad y Gobernanza de Digital Café Luna en AWS (Semana 5)
 * - Lab Evolutivo 06: Operación y Automatización de Digital Café Luna en AWS (Semana 6)
 * - Lab Evolutivo 07: Modernización de Digital Café Luna en AWS (Semana 7)
 */

// =============================================================================
// 1. GLOSARIO DE CONCEPTOS CLAVE Y FUNDAMENTOS TÉCNICOS
// =============================================================================
const glossaryData = [
  {
    term: "Reachability (Alcance de Red)",
    lab: "S05",
    badge: "Red vs Autorización",
    simple: "Capacidad de un paquete IP para viajar desde una interfaz de red (ENI en EC2) hasta el endpoint del servicio AWS a través de la infraestructura de enrutamiento (IGW, tablas de ruta y Security Groups).",
    analogy: "Tener una carretera pavimentada y el portón abierto para llegar hasta la puerta del banco. Que puedas pararte en la puerta no significa que el vigilante te deje abrir la caja fuerte.",
    inLab: "En el Lab 05 configuramos Internet Gateway y ruta 0.0.0.0/0 en Subnet A para que la EC2 alcance el endpoint público de S3. Si la red falla, la respuesta es 'Could not connect / Timeout', jamás 'AccessDenied'."
  },
  {
    term: "Authorization (Autorización IAM)",
    lab: "S05",
    badge: "Control de Acceso",
    simple: "Evaluación formal donde el motor de políticas de AWS determina si la identidad autenticada tiene permiso para ejecutar una acción específica (Action) sobre un recurso determinado (Resource).",
    analogy: "El oficial de seguridad revisando tu identificación contra el libro de registros para decidir si puedes acceder a la bóveda A o a la bóveda B.",
    inLab: "La misma instancia EC2 con el mismo IAM Role leyó con éxito 'allowed/context.txt' (PASS) pero recibió 'AccessDenied' al solicitar 'restricted/secret.txt'."
  },
  {
    term: "IAM Role & Credenciales Temporales",
    lab: "S05",
    badge: "Gestión de Identidades",
    simple: "Identidad de IAM sin credenciales estáticas permanentes, asumida por servicios como EC2 o Lambda mediante AWS Security Token Service (STS) que entrega llaves temporales autogestionadas.",
    analogy: "Un carnet digital con chip de radiofrecuencia que se renueva y expira automáticamente cada pocas horas, eliminando el riesgo de extraviar llaves maestras físicas.",
    inLab: "Eliminó la necesidad de ejecutar 'aws configure' o almacenar credenciales fijas (Access Key / Secret Key) dentro de la EC2 o en el código de Lambda."
  },
  {
    term: "Instance Profile (Perfil de Instancia)",
    lab: "S05",
    badge: "EC2 + IAM",
    simple: "Contenedor que permite asociar un rol de IAM a una instancia EC2 en tiempo de inicialización o en caliente.",
    analogy: "El porta-carnet físico con cordón donde insertas el chip de permisos para que el servidor lo porte consigo.",
    inLab: "Al crear el rol 'dcl-dev-role-s05' en la consola para el servicio EC2, AWS generó automáticamente un Instance Profile homónimo para asociarlo a la instancia virtual."
  },
  {
    term: "IAM Policy: Action vs Resource",
    lab: "S05",
    badge: "Estructura JSON",
    simple: "'Action' especifica la operación o verbo API permitido o denegado (ej. s3:GetObject). 'Resource' restringe el objeto o ARN específico sobre el cual recae dicha operación.",
    analogy: "'Action' es el verbo 'Leer', mientras que 'Resource' es el estante número 1. Si intentas 'Escribir' o 'Leer el estante 2', la petición es rechazada.",
    inLab: "Con Action: 's3:GetObject' y Resource: 'arn:aws:s3:::bucket/allowed/*', leer en restricted/ falló por Resource y escribir en allowed/ falló por Action."
  },
  {
    term: "s3:GetObject vs s3:PutObject",
    lab: "S05",
    badge: "Permisos S3",
    simple: "'s3:GetObject' concede permiso de lectura y descarga de bytes de un objeto existente. 's3:PutObject' autoriza la carga, creación o sobrescritura de objetos.",
    analogy: "GetObject es consultar un expediente existente; PutObject es archivar un documento nuevo en el archivador.",
    inLab: "Se validó que el rol tuviera únicamente s3:GetObject, verificando que los intentos de s3:PutObject fueran rechazados con AccessDenied de manera sistemática."
  },
  {
    term: "SSE-S3 (Server-Side Encryption)",
    lab: "S05",
    badge: "Cifrado en Reposo",
    simple: "Cifrado del lado del servidor gestionado por Amazon S3 (AES-256). Protege los bloques físicos de datos almacenados en los discos del centro de datos.",
    analogy: "Cerrar los archivadores con llave en la bodega del banco. Protege ante el robo del mueble físico, pero no decide si un empleado tiene autorización para consultar los expedientes.",
    inLab: "Cifrar el bucket con SSE-S3 demostró que el cifrado en reposo no influye en las decisiones de autorización ni produce errores de AccessDenied para usuarios autorizados."
  },
  {
    term: "CloudTrail: Management vs Data Events",
    lab: "S05",
    badge: "Auditoría & Trazabilidad",
    simple: "Management Events registran operaciones de plano de control (crear roles, asociar políticas). Data Events registran operaciones de plano de datos (leer/escribir objetos S3, invocar Lambdas).",
    analogy: "Management Events es el libro de actas notarial de contratación del personal. Data Events es la cámara que graba cada vez que alguien saca una hoja del cajón.",
    inLab: "En el Event History de CloudTrail se auditó 'AttachRolePolicy' (Management Event). No se visualizan 'GetObject' ni 'PutObject' porque corresponden a Data Events que requieren trails dedicados."
  },
  {
    term: "CloudFormation: Template vs Stack",
    lab: "S06",
    badge: "Infraestructura como Código (IaC)",
    simple: "El Template es la declaración declarativa en YAML/JSON del estado deseado. El Stack es la colección unificada de recursos aprovisionados y gestionados colectivamente.",
    analogy: "El Template es el plano arquitectónico en papel; el Stack es la edificación real construida y lista para operar.",
    inLab: "El archivo fuente fue 's06-ops-cloudformation.yaml' y la unidad aprovisionada en la cuenta fue el stack 'dcl-dev-stack-ops-s06'."
  },
  {
    term: "Logical ID vs Physical ID",
    lab: "S06",
    badge: "CloudFormation",
    simple: "El Logical ID es el identificador simbólico dentro de la plantilla. El Physical ID es el identificador único e inmutable asignado por AWS al crear el recurso en el entorno.",
    analogy: "Logical ID es la etiqueta 'VehículoDeCarga' en el contrato; Physical ID es la placa de matrícula 'i-09f42b...' asignada por el registro vehicular.",
    inLab: "El recurso lógico 'OpsInstance' del YAML se materializó en AWS con el Physical ID 'i-0123456789abcdef0'."
  },
  {
    term: "Update sin Reemplazo (In-Place)",
    lab: "S06",
    badge: "Ciclo de Vida IaC",
    simple: "Actualización de un stack donde los cambios se aplican a propiedades no críticas (como Tags o descripciones) sin requerir la destrucción y recreación del recurso.",
    analogy: "Cambiar la etiqueta identificadora en una máquina industrial sin necesidad de desarmarla ni detener la fábrica.",
    inLab: "Se actualizó el parámetro 'LabRevision' de v1 a v2, validando que el InstanceId de la instancia EC2 se mantuvo idéntico antes y después de la operación."
  },
  {
    term: "Basic Monitoring en Amazon EC2",
    lab: "S06",
    badge: "Métricas CloudWatch",
    simple: "Monitoreo estándar sin costo adicional provisto por el hipervisor de AWS, con granularidad de métricas cada 5 minutos (300 segundos).",
    analogy: "Un supervisor que realiza un control de temperatura cada 5 minutos exactos en lugar de monitorear segundo a segundo.",
    inLab: "Dado que cada datapoint toma 5 minutos y la alarma requiere 2 períodos consecutivos, la carga de UserData debió sostenerse durante 15 minutos (900 s)."
  },
  {
    term: "Period, EvaluationPeriods y DatapointsToAlarm",
    lab: "S06",
    badge: "Alarmas CloudWatch",
    simple: "Period: tamaño de la ventana de agregación (300 s). EvaluationPeriods: cantidad de ventanas recientes analizadas (2). DatapointsToAlarm: cantidad de períodos anómalos requeridos para cambiar a estado ALARM (2).",
    analogy: "Para emitir una alerta, el sistema exige comprobar que en 2 mediciones consecutivas de 5 minutos el promedio superó el 70%.",
    inLab: "La alarma inició en estado 'INSUFFICIENT_DATA' hasta completar la recolección de los dos períodos de métricas requeridos."
  },
  {
    term: "UserData en Amazon EC2",
    lab: "S06",
    badge: "Automatización de Arranque",
    simple: "Script de shell ejecutado con privilegios de root una única vez durante el primer inicio de la instancia para configuración y arranque autónomo.",
    analogy: "La lista de instrucciones preprogramadas que ejecuta un dispositivo al encenderse por primera vez de fábrica.",
    inLab: "Se ejecutaron 2 bucles de saturación de CPU con 'timeout 900 bash -c \"while :; do :; done\"' sin requerir conexión SSH ni acceso a Internet."
  },
  {
    term: "Arquitectura Orientada a Eventos (Serverless)",
    lab: "S07",
    badge: "Modernización",
    simple: "Patrón desacoplado donde los componentes reaccionan a cambios de estado emitidos por un productor (S3) mediante la ejecución efímera de funciones (Lambda).",
    analogy: "Un timbre que suena solo cuando llega un paquete, en lugar de mantener a una persona esperando 24/7 en la puerta.",
    inLab: "La subida de 'incoming/order-001.json' generó el evento 'ObjectCreated:Put' que invocó a Lambda durante escasos ~2 milisegundos."
  },
  {
    term: "Execution Role vs Resource-based Policy",
    lab: "S07",
    badge: "Seguridad en Lambda",
    simple: "Resource-based Policy: autoriza la invocación entrante (de S3 a Lambda). Execution Role: autoriza las llamadas salientes (de Lambda a CloudWatch Logs).",
    analogy: "Resource-based policy es la autorización que permite a la oficina postal tocar a tu puerta; Execution Role es tu credencial para redactar reportes en el archivo central.",
    inLab: "Al configurar el trigger de S3 se generó la Resource-based policy; el Execution Role 'dcl-dev-role-lambda-s07' se configuró exclusivamente con permisos de escritura de logs."
  },
  {
    term: "Filtros de Notificación S3 (Prefix & Suffix)",
    lab: "S07",
    badge: "Disparadores de Eventos",
    simple: "Criterios de coincidencia en el productor de eventos que restringen el disparo de notificaciones según el prefijo (carpeta) y sufijo (extensión) del objeto.",
    analogy: "Filtrar la bandeja de correspondencia para tramitar únicamente cartas que provengan de la carpeta 'incoming/' y terminen en formato '.json'.",
    inLab: "Se configuró Prefix='incoming/' y Suffix='.json', previniendo activamente bucles infinitos de auto-invocación recursiva."
  },
  {
    term: "Log Group Precreado y Retención",
    lab: "S07",
    badge: "CloudWatch Logs",
    simple: "Creación anticipada del contenedor de logs en CloudWatch con política de retención explícita (1 día), acotando los permisos requeridos por el rol de Lambda.",
    analogy: "Habilitar un cuaderno de registros con vigencia de un día para que el operador solo tenga permiso de escribir, sin facultades para crear cuadernos arbitrarios.",
    inLab: "Precrear '/aws/lambda/dcl-dev-order-event-s07' permitió retirar 'logs:CreateLogGroup' del rol, dejando únicamente 'CreateLogStream' y 'PutLogEvents'."
  },
  {
    term: "Garantía de Entrega At-Least-Once",
    lab: "S07",
    badge: "Semántica de Eventos",
    simple: "Garantía de los sistemas de mensajería distribuida donde AWS asegura que todo evento llegará al menos una vez al consumidor, pudiendo presentar duplicados esporádicos.",
    analogy: "Un mensajero que ante la duda de si recibiste el mensaje, te entrega una segunda copia de seguridad.",
    inLab: "La presencia eventual de dos ejecuciones en CloudWatch para un mismo objeto es inherente a la arquitectura distribuida de Amazon S3 y no un error de diseño."
  },
  {
    term: "Baseline S01 (Infraestructura Base Persistente)",
    lab: "S05",
    badge: "Gobernanza Cloud",
    simple: "Topología de red fundacional ('dcl-dev-vpc' 10.20.0.0/16 con subredes Multi-AZ) diseñada para ser inmutable y compartida entre laboratorios.",
    analogy: "El terreno y acometidas principales de una urbanización, sobre los cuales se construyen estructuras modulares transitorias.",
    inLab: "En cada sesión se despliegan recursos temporales y se destruyen en el cleanup garantizando que el Baseline S01 permanezca intacto."
  }
];

// =============================================================================
// 2. DETALLE PASO A PASO TAL CUAL ESTÁ EN LAS GUÍAS DE LOS LABORATORIOS
// =============================================================================
const labsData = {
  lab5: {
    title: "Laboratorio Evolutivo 05: Seguridad y Gobernanza de Digital Café Luna en AWS",
    badge: "Semana 5 · Cuenta AWS estándar · us-east-1",
    duration: "80–90 min · Equipos de 4 · Carácter formativo con evidencia",
    goal: "Demostrar que reachability no implica authorization: una misma instancia, con el mismo IAM Role y la misma conectividad, puede obtener un objeto y recibir AccessDenied sobre otro cuando la policy cambia el alcance de la autorización.",
    summary: "Al finalizar, el equipo habrá usado credenciales temporales entregadas mediante un IAM Role para EC2, habrá demostrado un GetObject permitido, dos denegaciones controladas por Action/Resource, habrá verificado cifrado SSE-S3 y habrá localizado un management event pertinente en CloudTrail Event history.",
    diagram: [
      { icon: "🌐", name: "Baseline S01", sub: "dcl-dev-vpc (10.20.0.0/16)" },
      { icon: "🖥️", name: "EC2 Temporal", sub: "Subnet A (t3.micro + EIC)" },
      { icon: "🪪", name: "IAM Role", sub: "dcl-dev-role-s05 (IMDS)" },
      { icon: "📜", name: "Policy Acotada", sub: "s3:GetObject en allowed/*" },
      { icon: "🪣", name: "Bucket S3 (SSE-S3)", sub: "Privado (BPA Activo)" },
      { icon: "🕵️", name: "CloudTrail", sub: "AttachRolePolicy en Event History" }
    ],
    // Glosario específico de este laboratorio
    labGlossaryTerms: [
      "Reachability (Alcance de Red)",
      "Authorization (Autorización IAM)",
      "IAM Role & Credenciales Temporales",
      "Instance Profile (Perfil de Instancia)",
      "IAM Policy: Action vs Resource",
      "s3:GetObject vs s3:PutObject",
      "SSE-S3 (Server-Side Encryption)",
      "CloudTrail: Management vs Data Events",
      "Baseline S01 (Infraestructura Base Persistente)"
    ],
    // Pasos oficiales desglosados tal cual el profesor
    steps: [
      {
        num: "Preflight",
        title: "3. Preflight Técnico: Confirmación de Baseline y Aislamiento",
        what: "Confirmar el baseline, los permisos normales de la cuenta y las condiciones que hacen inequívoca la prueba de autorización.",
        why: "Si sobreviven recursos de labs anteriores, existe una bucket policy ajena o se usan credenciales manuales, un AccessDenied puede tener otra causa y la evidencia deja de demostrar la intención de S05.",
        subItems: [
          "1. Inicien sesión en la cuenta AWS y seleccionen us-east-1.",
          "2. Confirmen dcl-dev-vpc y las dos subnets con sus CIDR exactos y AZ distintas (dcl-dev-vpc: 10.20.0.0/16, Subnet A: 10.20.1.0/24, Subnet B: 10.20.2.0/24).",
          "3. Verifiquen que no existan EC2, IGW, route tables o Security Groups temporales de S02–S04 que condicionen la prueba.",
          "4. Confirmen permisos normales para S3, IAM, EC2, VPC y CloudTrail Event history. Si una SCP, permissions boundary u otra política externa bloquea el lab, registren el control; no amplíen permisos a ciegas.",
          "5. No creen access keys ni ejecuten aws configure en la EC2. El workload debe obtener credenciales desde su IAM Role.",
          "6. Antes de las pruebas, el bucket no debe tener una bucket policy creada por otro ejercicio y los dos objetos de prueba deben existir con nombres exactos."
        ],
        cliCommands: `# 1. Verificar identidad actual y región us-east-1
aws sts get-caller-identity
aws configure get region

# 2. Confirmar Baseline S01 persistente
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=dcl-dev-vpc" \\
  --query 'Vpcs[*].{VpcId:VpcId,CidrBlock:CidrBlock}' --output table

aws ec2 describe-subnets --filters "Name=vpc-id,Values=<VPC_ID>" \\
  --query 'Subnets[*].{SubnetId:SubnetId,Name:Tags[?Key==\`Name\`].Value|[0],Cidr:CidrBlock,AZ:AvailabilityZone}' --output table`,
        validation: "El baseline coincide con S01; el entorno temporal está limpio; el equipo puede explicar que la prueba comparará la misma red y la misma identidad, modificando únicamente Action/Resource.",
        evidence: "Validación de entorno limpio y verificación del Baseline S01 sin access keys manuales.",
        examTip: "Regla crítica del profesor: No creen access keys ni ejecuten aws configure en la EC2. El workload debe obtener credenciales desde su IAM Role."
      },
      {
        num: "Paso 1",
        title: "Paso 1 — Crear el Bucket y los Dos Objetos",
        what: "Crear un bucket S3 privado y dos objetos existentes bajo prefijos distintos.",
        why: "El objeto restricted debe existir antes del AccessDenied; de lo contrario, un error de nombre o un recurso inexistente podría confundirse con autorización.",
        subItems: [
          "7. En S3, creen dcl-s05-teamXX-<account-id> en us-east-1.",
          "8. Mantengan Block Public Access habilitado. No creen bucket policy para este lab.",
          "9. Mantengan Default encryption en SSE-S3. No utilicen una customer managed KMS key.",
          "10. Suban allowed/context.txt con un texto breve como 'Digital Café Luna — lectura autorizada'.",
          "11. Suban restricted/secret.txt con un texto breve diferente, por ejemplo 'Digital Café Luna — recurso restringido'.",
          "12. No habiliten Versioning; S03 ya cubrió ese comportamiento."
        ],
        cliCommands: `# 1. Crear bucket S3 privado en us-east-1 con Block Public Access estricto
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET="dcl-s05-team01-\${ACCOUNT_ID}"
aws s3api create-bucket --bucket "$BUCKET" --region us-east-1

aws s3api put-public-access-block --bucket "$BUCKET" \\
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# 2. Subir ambos objetos de texto
echo "Digital Café Luna — lectura autorizada" > context.txt
echo "Digital Café Luna — recurso restringido" > secret.txt
aws s3 cp context.txt "s3://\${BUCKET}/allowed/context.txt"
aws s3 cp secret.txt "s3://\${BUCKET}/restricted/secret.txt"`,
        validation: "Ambos objetos existen en el mismo bucket; el bucket es privado; Default encryption muestra SSE-S3.",
        evidence: "Registren el nombre del bucket y la vista donde se observan ambos keys. Esta captura apoya la prueba, pero no sustituye la evidencia de autorización efectiva.",
        examTip: "SSE-S3 cifra datos at rest. NO tiene relación con quién recibe AccessDenied. Quien bloquea o permite es la política de IAM."
      },
      {
        num: "Paso 2",
        title: "Paso 2 — Crear Policy, Role e Instance Profile",
        what: "Crear una policy mínima y asociarla a un IAM Role para EC2.",
        why: "El workload necesita una identidad con permisos precisos. El IAM console crea el instance profile de EC2 con el mismo nombre del role; ese profile es el contenedor que entrega el role a la instancia.",
        subItems: [
          "Creen primero la customer managed policy dcl-dev-policy-s3-read-allowed-s05 usando el JSON siguiente. Sustituyan BUCKET_NAME por el nombre real; no agreguen s3:ListBucket, s3:* ni Resource: '*'.",
          "13. Creen dcl-dev-role-s05 con trusted entity = AWS service y use case = EC2.",
          "14. Adjunten dcl-dev-policy-s3-read-allowed-s05 al role. Hagan esta asociación explícitamente: generará un management event AttachRolePolicy útil para CloudTrail.",
          "15. Confirmen que el role no tenga otras policies que otorguen acceso S3 y que el instance profile dcl-dev-role-s05 esté disponible para EC2."
        ],
        cliCommands: `# 1. Crear documento JSON de la customer managed policy
cat << 'EOF' > policy-s05.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadAllowedPrefixOnly",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dcl-s05-team01-ACCOUNT_ID/allowed/*"
    }
  ]
}
EOF

# 2. Crear customer managed policy
aws iam create-policy --policy-name dcl-dev-policy-s3-read-allowed-s05 \\
  --policy-document file://policy-s05.json

# 3. Crear IAM Role y asociar política (Genera evento en CloudTrail)
aws iam create-role --role-name dcl-dev-role-s05 \\
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

aws iam attach-role-policy --role-name dcl-dev-role-s05 \\
  --policy-arn arn:aws:iam::\${ACCOUNT_ID}:policy/dcl-dev-policy-s3-read-allowed-s05

# 4. Crear Instance Profile si se usa CLI (la consola lo crea en automático)
aws iam create-instance-profile --instance-profile-name dcl-dev-role-s05
aws iam add-role-to-instance-profile --instance-profile-name dcl-dev-role-s05 --role-name dcl-dev-role-s05`,
        validation: "El role tiene una única policy funcional para el lab y esa policy concede solo s3:GetObject sobre arn:aws:s3:::<bucket>/allowed/*.",
        evidence: "Rol creado con una única política adjunta; evento AttachRolePolicy generado en CloudTrail.",
        examTip: "Al adjuntar la política explícitamente, se emite el evento 'AttachRolePolicy' hacia CloudTrail, respondiendo quién hizo el cambio administrativo y cuándo."
      },
      {
        num: "Paso 3",
        title: "Paso 3 — Hacer Pública Temporalmente la Subnet A",
        what: "Recrear solo el camino mínimo ya conocido desde S04 para acceder a una EC2 temporal y permitirle llegar a endpoints públicos de AWS.",
        why: "Subnet A no conserva el IGW ni la route table de S04. La conectividad es prerrequisito operativo; no forma parte de la variable de autorización que vamos a cambiar.",
        subItems: [
          "16. Creen dcl-dev-igw-s05 y adjúntenlo a dcl-dev-vpc.",
          "17. Creen dcl-dev-rt-public-a-s05 y agreguen 0.0.0.0/0 → dcl-dev-igw-s05.",
          "18. Asocien únicamente dcl-dev-subnet-a a esa route table. No modifiquen Subnet B.",
          "19. Creen dcl-dev-sg-ec2-s05. Inbound: SSH TCP/22 únicamente desde el AWS-managed prefix list com.amazonaws.us-east-1.ec2-instance-connect. Outbound: default."
        ],
        cliCommands: `# 1. Crear Internet Gateway y adjuntarlo a la VPC
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 create-tags --resources "$IGW_ID" --tags Key=Name,Value=dcl-dev-igw-s05
aws ec2 attach-internet-gateway --vpc-id <VPC_ID> --internet-gateway-id "$IGW_ID"

# 2. Crear Route Table temporal para Subnet A con salida 0.0.0.0/0 -> IGW
RT_ID=$(aws ec2 create-route-table --vpc-id <VPC_ID> --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-tags --resources "$RT_ID" --tags Key=Name,Value=dcl-dev-rt-public-a-s05
aws ec2 create-route --route-table-id "$RT_ID" --destination-cidr-block 0.0.0.0/0 --gateway-id "$IGW_ID"
aws ec2 associate-route-table --subnet-id <SUBNET_A_ID> --route-table-id "$RT_ID"

# 3. Crear Security Group con acceso SSH restringido a EC2 Instance Connect
SG_ID=$(aws ec2 create-security-group --group-name dcl-dev-sg-ec2-s05 --description "SG S05" --vpc-id <VPC_ID> --query 'GroupId' --output text)
EIC_PL=$(aws ec2 describe-prefix-lists --filters "Name=prefix-list-name,Values=com.amazonaws.us-east-1.ec2-instance-connect" --query 'PrefixLists[0].PrefixListId' --output text)
aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 22 --prefix-list-id "$EIC_PL"`,
        validation: "Subnet A tiene temporalmente local + 0.0.0.0/0 → IGW; Subnet B permanece intacta; el SG no abre SSH a 0.0.0.0/0.",
        evidence: "Tabla de rutas asociada a Subnet A con salida a IGW; Security Group con ingress acotado al prefix list de EIC.",
        examTip: "Si olvidaran el IGW o la ruta, la terminal arrojaría 'Could not connect to the endpoint URL' (Timeout), jamás AccessDenied."
      },
      {
        num: "Paso 4 y 5",
        title: "Paso 4 y 5 — Lanzar EC2 con IAM Role y Conectar con EC2 Instance Connect",
        what: "Lanzar una sola EC2 pequeña con public IPv4 y el instance profile dcl-dev-role-s05, y abrir terminal en dcl-dev-ec2-s05.",
        why: "Todas las pruebas deben ejecutarse desde la misma identidad y la misma red para que la diferencia observable dependa de la policy. Amazon Linux 2023 incluye AWS CLI v2 y EC2 Instance Connect.",
        subItems: [
          "20. AMI: Amazon Linux 2023 estándar; instance type: t3.micro o el tipo pequeño equivalente definido por el curso.",
          "21. Subnet = dcl-dev-subnet-a; Auto-assign public IP = Enable; Security Group = dcl-dev-sg-ec2-s05.",
          "22. IAM instance profile = dcl-dev-role-s05. Procedan sin key pair; EC2 Instance Connect será el método de acceso.",
          "23. Root volume mínimo y Delete on termination = Yes. No agreguen discos ni software adicional.",
          "Paso 5: Abrir terminal desde EC2 > Connect > EC2 Instance Connect > Connect using a Public IP.",
          "Ejecutar 'aws --version' y 'aws configure list'."
        ],
        cliCommands: `# Lanzar la instancia EC2 con su Instance Profile
aws ec2 run-instances --image-id ami-0c101f26f147fa7ab --count 1 --instance-type t3.micro \\
  --iam-instance-profile Name=dcl-dev-role-s05 \\
  --subnet-id <SUBNET_A_ID> --security-group-ids "$SG_ID" \\
  --associate-public-ip-address \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=dcl-dev-ec2-s05}]'

# Dentro de la terminal de la EC2:
aws --version
aws configure list`,
        validation: "EC2 está running, tiene public IPv4, muestra IAM Role dcl-dev-role-s05 y pasa status checks. La terminal está disponible y no existe credencial persistente creada manualmente.",
        evidence: "Salida de aws configure list demostrando que el proveedor de credenciales es 'iam-role' (ec2-instance-metadata).",
        examTip: "Al consultar 'aws configure list', las credenciales provienen de IMDSv2 mediante el rol asumido, sin llaves fijas."
      },
      {
        num: "Prueba Central",
        title: "5. Prueba Central — Misma Identidad, Distinto Alcance (4 Pruebas)",
        what: "Definan el bucket una sola vez y no cambien de terminal, role ni red entre pruebas.",
        why: "Demostrar que una misma identidad en el mismo host produce comportamientos distintos según la Action y el Resource definidos en la política IAM.",
        subItems: [
          "Definir variable: export BUCKET='dcl-s05-teamXX-<account-id>' && echo 'Bucket de prueba: \${BUCKET}'",
          "Prueba 1 — Identidad del workload: consultar la identidad efectiva usada por AWS CLI (aws sts get-caller-identity).",
          "Prueba 2 — Resource permitido: PASS: ejecutar s3:GetObject sobre allowed/context.txt (PASS y cat del contenido).",
          "Prueba 3 — Mismas Action/red/identidad, Resource fuera de alcance: s3:GetObject sobre restricted/secret.txt (AccessDenied).",
          "Prueba 4 — Resource permitido, Action no concedida: s3:PutObject sobre allowed/write-test.txt (AccessDenied)."
        ],
        cliCommands: `# Definir el bucket una sola vez
export BUCKET="dcl-s05-team01-ACCOUNT_ID"
echo "Bucket de prueba: \${BUCKET}"

# Prueba 1: Identidad del workload
aws sts get-caller-identity --query '{Account:Account,Arn:Arn}' --output table

# Prueba 2: Resource permitido -> PASS
aws s3api get-object \\
  --bucket "$BUCKET" \\
  --key allowed/context.txt \\
  /tmp/context.txt
cat /tmp/context.txt

# Prueba 3: Mismas Action/red/identidad, Resource fuera de alcance -> AccessDenied
aws s3api get-object \\
  --bucket "$BUCKET" \\
  --key restricted/secret.txt \\
  /tmp/secret.txt

# Prueba 4: Resource permitido, Action no concedida -> AccessDenied
printf 'write test\\n' > /tmp/write-test.txt
aws s3api put-object \\
  --bucket "$BUCKET" \\
  --key allowed/write-test.txt \\
  --body /tmp/write-test.txt`,
        validation: "Prueba 1: ARN contiene assumed-role/dcl-dev-role-s05/... | Prueba 2: PASS sin error | Prueba 3: AccessDenied por Resource | Prueba 4: AccessDenied por Action.",
        evidence: "Captura de terminal con las 4 pruebas consecutivas ejecutadas en la misma sesión.",
        examTip: "Si la Prueba 4 llega a escribir el archivo, detengan la prueba: existe otro permiso que amplía el rol y no se está demostrando least privilege."
      },
      {
        num: "Paso 6 y 7",
        title: "6. Cifrado y Trazabilidad (Paso 6 y Paso 7)",
        what: "Revisar Default encryption en S3 y localizar el management event AttachRolePolicy en CloudTrail Event history.",
        why: "Cifrado y autorización resuelven problemas distintos. Event history permite atribuir acciones de administración sin crear un trail dedicado.",
        subItems: [
          "Paso 6: Revisar S3 > bucket > Properties > Default encryption (SSE-S3). No presentarla como evidencia de autorización.",
          "24. Mantengan us-east-1 seleccionada en CloudTrail > Event history (muestra últimos 90 días).",
          "25. Filtren Event name = AttachRolePolicy. Si todavía no aparece, esperen unos minutos y refresquen.",
          "26. Elijan el evento cuyo requestParameters.roleName sea dcl-dev-role-s05 y policyArn dcl-dev-policy-s3-read-allowed-s05.",
          "27. En Event record identifiquen userIdentity/principal, eventTime, eventName/eventSource, requestParameters y contexto del recurso.",
          "OJO TÉCNICO: PutObject, GetObject y DeleteObject son data events. CloudTrail Event history solo muestra management events. No creen un trail ni habiliten data events."
        ],
        cliCommands: `# Consultar auditoría con AWS CLI
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=AttachRolePolicy \\
  --query 'Events[?contains(Resources[?ResourceName==\`dcl-dev-role-s05\`].ResourceName, \`dcl-dev-role-s05\`)].{Name:EventName,Time:EventTime,User:Username,Params:CloudTrailEvent}'`,
        validation: "Default encryption = SSE-S3. El equipo puede señalar principal, acción, momento y role/policy afectados en un evento real de CloudTrail.",
        evidence: "Captura de Default encryption SSE-S3 y detalle de AttachRolePolicy en CloudTrail Event history.",
        examTip: "¿Por qué no buscamos GetObject o PutObject en CloudTrail Event history? Porque son Data Events y el historial gratuito de 90 días solo guarda Management Events."
      },
      {
        num: "Cleanup",
        title: "9. Costos, Conservación y Cleanup Obligatorio",
        what: "Eliminar todos los recursos temporales creados para S05 garantizando que el Baseline S01 quede intacto.",
        why: "Evitar costos en la cuenta (EC2, root EBS, public IPv4) y preservar la inmutabilidad de la VPC y subredes persistentes.",
        subItems: [
          "CONSERVAR COMO BASELINE: dcl-dev-vpc (10.20.0.0/16), dcl-dev-subnet-a (10.20.1.0/24 con su AZ), dcl-dev-subnet-b (10.20.2.0/24 con su AZ), naming/tags del proyecto.",
          "28. Terminen dcl-dev-ec2-s05 y verifiquen que su root EBS no quede huérfano.",
          "29. Eliminen dcl-dev-sg-ec2-s05 cuando ya no tenga dependencias.",
          "30. Desasocien dcl-dev-rt-public-a-s05 de Subnet A (vuelve a la main route table). Eliminen la route table temporal.",
          "31. Desadjunten y eliminen dcl-dev-igw-s05.",
          "32. Vacíen el bucket S3 y elimínenlo. Si Versioning se habilitó accidentalmente, eliminen todas las versiones y delete markers antes.",
          "33. Desadjunten dcl-dev-policy-s3-read-allowed-s05 del role y eliminen la customer managed policy.",
          "34. Eliminen dcl-dev-role-s05. Si se creó desde IAM console, verifiquen que el instance profile del mismo nombre también haya sido eliminado.",
          "35. Eliminen cualquier objeto de troubleshooting o recurso accidental que no pertenezca al baseline S01."
        ],
        cliCommands: `# Cleanup obligatorio S05
aws ec2 terminate-instances --instance-ids <INSTANCE_ID>
aws ec2 delete-security-group --group-id <SG_ID>
aws ec2 detach-internet-gateway --internet-gateway-id <IGW_ID> --vpc-id <VPC_ID>
aws ec2 delete-internet-gateway --internet-gateway-id <IGW_ID>
aws ec2 delete-route-table --route-table-id <RT_ID>
aws s3 rm s3://\${BUCKET} --recursive
aws s3api delete-bucket --bucket \${BUCKET}
aws iam detach-role-policy --role-name dcl-dev-role-s05 --policy-arn <POLICY_ARN>
aws iam delete-policy --policy-arn <POLICY_ARN>
aws iam remove-role-from-instance-profile --instance-profile-name dcl-dev-role-s05 --role-name dcl-dev-role-s05
aws iam delete-instance-profile --instance-profile-name dcl-dev-role-s05
aws iam delete-role --role-name dcl-dev-role-s05`,
        validation: "No quedan EC2, public IPv4, Security Group, route table, IGW, bucket/objetos, policy, instance profile ni IAM Role de S05. Permanecen únicamente VPC y dos subnets de S01.",
        evidence: "Validación de cleanup formal sin recursos huérfanos.",
        examTip: "Al cerrar S05, el equipo debe poder explicar esta cadena sin mezclar controles: reachability permite que el workload llegue al endpoint; el role define la identidad; la policy limita Action y Resource; encryption protege datos at rest; CloudTrail permite atribuir acciones de administración."
      }
    ],
    codeTitle: "Documento JSON de Política IAM (Lab 05)",
    codeLines: [
      { code: '{', exp: 'Apertura del objeto JSON de la política IAM de cliente.' },
      { code: '  "Version": "2012-10-17",', exp: 'Versión oficial de la sintaxis del motor de evaluación de políticas.' },
      { code: '  "Statement": [', exp: 'Array que agrupa las reglas de autorización.' },
      { code: '    {', exp: 'Declaración única de mínimo privilegio estricto.' },
      { code: '      "Sid": "ReadAllowedPrefixOnly",', exp: 'Statement ID descriptivo: lectura exclusiva al prefijo allowed/.' },
      { code: '      "Effect": "Allow",', exp: 'Efecto explícito: Permitir. Todo lo no mencionado queda bajo Implicit Deny.' },
      { code: '      "Action": "s3:GetObject",', exp: 'ÚNICA acción concedida: descargar/leer objetos. No concede PutObject ni ListBucket.' },
      { code: '      "Resource": "arn:aws:s3:::BUCKET_NAME/allowed/*"', exp: 'ÚNICO recurso autorizado: objetos bajo allowed/*. Al solicitar restricted/secret.txt el recurso no coincide y falla.' },
      { code: '    }', exp: 'Cierre de la declaración.' },
      { code: '  ]', exp: 'Cierre del array Statement.' },
      { code: '}', exp: 'Cierre de la política.' }
    ]
  },
  lab6: {
    title: "Laboratorio Evolutivo 06: Operación y Automatización de Digital Café Luna en AWS",
    badge: "Semana 6 · Cuenta AWS estándar · us-east-1",
    duration: "80–90 min · Equipos de 4 · Carácter formativo con evidencia",
    goal: "Demostrar que una arquitectura cloud debe ser observable y repetible, no solamente existir. El equipo desplegará una unidad declarativa con CloudFormation, observará una señal causada de forma controlada, realizará un cambio no destructivo y eliminará el entorno completo mediante el mismo stack.",
    summary: "Al finalizar, el equipo podrá reconstruir la cadena: definición declarativa → stack → EC2 → carga local → CPUUtilization → condición → alarma → evidencia → update → cleanup declarativo.",
    diagram: [
      { icon: "📄", name: "Template YAML", sub: "s06-ops-cloudformation.yaml" },
      { icon: "🥞", name: "CloudFormation Stack", sub: "dcl-dev-stack-ops-s06" },
      { icon: "🖥️", name: "EC2 Temporal (t3.micro)", sub: "Sin IP pública · Sin Internet" },
      { icon: "⚙️", name: "UserData (2 loops)", sub: "timeout 900 bash (15 min)" },
      { icon: "📈", name: "Métrica CloudWatch", sub: "CPUUtilization (Basic 300 s)" },
      { icon: "🚨", name: "CloudWatch Alarm", sub: ">=70% en 2 de 2 períodos" }
    ],
    // Glosario específico de este laboratorio
    labGlossaryTerms: [
      "CloudFormation: Template vs Stack",
      "Logical ID vs Physical ID",
      "Update sin Reemplazo (In-Place)",
      "Basic Monitoring en Amazon EC2",
      "Period, EvaluationPeriods y DatapointsToAlarm",
      "UserData en Amazon EC2",
      "Baseline S01 (Infraestructura Base Persistente)"
    ],
    // Pasos oficiales desglosados tal cual el profesor
    steps: [
      {
        num: "Preflight",
        title: "2. Baseline y Preflight",
        what: "Confirmar Región, baseline S01 y permisos normales de la cuenta antes de desplegar.",
        why: "El stack depende de recursos persistentes que ya existen, pero no debe recrearlos ni modificar su conectividad. La EC2 no necesita Internet, public IPv4, SSH ni access keys.",
        subItems: [
          "1. Confirmen que VPC y Subnet A pertenecen a us-east-1 y registren sus IDs.",
          "2. Confirmen que no existe un stack dcl-dev-stack-ops-s06 activo de una ejecución anterior.",
          "3. La identidad de la consola debe poder usar CloudFormation, EC2, CloudWatch y leer el parámetro público de SSM. No creen access keys como workaround.",
          "4. Si una policy IAM/SCP o una quota bloquea el despliegue, registren el evento del stack antes de cambiar la configuración."
        ],
        cliCommands: `# Obtener IDs del baseline S01
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=dcl-dev-vpc" --query 'Vpcs[0].VpcId' --output text)
SUBNET_A_ID=$(aws ec2 describe-subnets --filters "Name=tag:Name,Values=dcl-dev-subnet-a" --query 'Subnets[0].SubnetId' --output text)
echo "VPC: $VPC_ID | Subnet A: $SUBNET_A_ID"`,
        validation: "El baseline coincide con S01 y el equipo dispone de los IDs de VPC/Subnet. No se introduce conectividad adicional.",
        evidence: "Registro de IDs de VPC y Subnet A del baseline S01.",
        examTip: "La EC2 temporal del Lab 06 no expone IP pública ni requiere salida a Internet. Su carga es 100% autónoma en local."
      },
      {
        num: "Paso 1",
        title: "3. Template de Trabajo y Prueba 1 — Validar IaC antes de Desplegar",
        what: "Revisar la estructura del template y ejecutar una validación sin crear recursos.",
        why: "template válido ≠ infraestructura desplegada. La lectura debe permitir reconocer parámetros, referencias y dependencias sin convertir S06 en un taller de YAML.",
        subItems: [
          "5. Guarden el bloque YAML como s06-ops-cloudformation.yaml.",
          "6. En CloudShell pueden cargar el archivo y ejecutar el comando siguiente. CloudShell usa la sesión autenticada; no creen access keys.",
          "7. Identifiquen VpcId, SubnetId, AmiId, CpuThreshold y LabRevision; luego identifiquen OpsSecurityGroup, OpsInstance y CpuHighAlarm.",
          "Ejecutar 'aws cloudformation validate-template --template-body file://s06-ops-cloudformation.yaml'",
          "OJO TÉCNICO: Monitoring: false conserva basic monitoring. CPUUtilization se publica en períodos de 5 minutos; la alarma usa Period=300, EvaluationPeriods=2 y DatapointsToAlarm=2. El user data mantiene dos procesos CPU-bound durante 900 s y termina solo."
        ],
        cliCommands: `# Validar sintaxis y parámetros del template YAML
aws cloudformation validate-template \\
  --template-body file://s06-ops-cloudformation.yaml`,
        validation: "El comando devuelve Description/Parameters sin ValidationError. Todavía no existe stack ni infraestructura S06.",
        evidence: "Salida JSON de la CLI conteniendo parámetros tipados sin errores sintácticos.",
        examTip: "deployed ≠ operable: CREATE_COMPLETE no sustituye evidencia de comportamiento; validate-template solo revisa formato."
      },
      {
        num: "Paso 2",
        title: "4. Prueba 2 — Crear el Stack y Mapear Recursos Lógicos a Físicos",
        what: "Crear dcl-dev-stack-ops-s06 usando el template validado y los IDs del baseline.",
        why: "CloudFormation convierte definiciones lógicas en recursos físicos y conserva el estado del despliegue como una unidad administrada.",
        subItems: [
          "8. En CloudFormation > Stacks, seleccionen Create stack > With new resources y carguen s06-ops-cloudformation.yaml.",
          "9. Stack name = dcl-dev-stack-ops-s06.",
          "10. VpcId = ID de dcl-dev-vpc; SubnetId = ID de dcl-dev-subnet-a; CpuThreshold = 70; LabRevision = v1. Mantengan el AmiId por defecto.",
          "11. No agreguen IAM capabilities: el template no crea recursos IAM.",
          "12. Creen el stack y sigan la pestaña Events hasta CREATE_COMPLETE.",
          "CREATE_COMPLETE demuestra que CloudFormation terminó el despliegue. No demuestra que la EC2 esté produciendo la señal esperada ni que la alarma haya evaluado la condición.",
          "Mapeo Logical resource → physical resource: OpsSecurityGroup -> SG físico, OpsInstance -> InstanceId, CpuHighAlarm -> Nombre físico de alarma.",
          "Ventana de observación: El experimento usa basic monitoring (5 min). La carga dura 15 minutos para cubrir al menos dos períodos completos aun si el primer datapoint es parcial. Reserven 25–35 minutos desde el inicio del stack."
        ],
        cliCommands: `# Desplegar stack con parámetros específicos
aws cloudformation create-stack \\
  --stack-name dcl-dev-stack-ops-s06 \\
  --template-body file://s06-ops-cloudformation.yaml \\
  --parameters ParameterKey=VpcId,ParameterValue=\${VPC_ID} \\
               ParameterKey=SubnetId,ParameterValue=\${SUBNET_A_ID} \\
               ParameterKey=CpuThreshold,ParameterValue=70 \\
               ParameterKey=LabRevision,ParameterValue=v1

# Esperar estado CREATE_COMPLETE
aws cloudformation wait stack-create-complete --stack-name dcl-dev-stack-ops-s06

# Mapear Logical ID a Physical ID
aws cloudformation describe-stack-resources --stack-name dcl-dev-stack-ops-s06 \\
  --query 'StackResources[*].{Logical:LogicalResourceId,Physical:PhysicalResourceId,Type:ResourceType,Status:ResourceStatus}' --output table`,
        validation: "Stack = CREATE_COMPLETE; EC2 = running; la instancia no tiene public IPv4; el SG no tiene inbound; la pestaña Resources permite mapear cada logical ID con su physical ID.",
        evidence: "Captura de CREATE_COMPLETE + tabla/registro breve con los tres mappings. Eviten capturas redundantes de cada recurso por separado.",
        examTip: "Regla de oro: Ver CREATE_COMPLETE solo demuestra que los recursos fueron creados; no demuestra que la carga funcione."
      },
      {
        num: "Paso 3 y 4",
        title: "5. Prueba 3 y 4 — Observar CPUUtilization y la Alarma",
        what: "Buscar la métrica CPUUtilization de la EC2 creada por el stack y observar cómo la alarma evalúa dicha métrica.",
        why: "Una métrica solo es evidencia cuando podemos explicar qué comportamiento la produjo. Una alarma expresa una condición sobre una señal; no diagnostica por sí sola la salud de la instancia.",
        subItems: [
          "13. Copien el InstanceId desde CloudFormation > Resources.",
          "14. Abrir CloudWatch > Metrics > All metrics > EC2 > Per-Instance Metrics.",
          "15. Filtren por InstanceId y seleccionen CPUUtilization.",
          "16. Usen Statistic = Average y Period = 5 minutes; ajusten la ventana temporal para incluir el arranque de la instancia.",
          "17. Esperen a que aparezcan datapoints y observen una elevación claramente asociada al intervalo de carga.",
          "Prueba 4: Abrir la alarma del stack. Configuración: Métrica AWS/EC2 CPUUtilization, Dimension InstanceId=OpsInstance, Statistic=Average, Period=300s/5min, Threshold>=70%, EvaluationPeriods=2, DatapointsToAlarm=2, TreatMissingData=missing, ActionsEnabled=false.",
          "ALARM no significa automáticamente que la instancia esté dañada. Significa que, con esta configuración, suficientes datapoints hicieron verdadera la condición >=70%."
        ],
        cliCommands: `# 1. Obtener InstanceId del recurso lógico OpsInstance
INSTANCE_ID=$(aws cloudformation describe-stack-resource --stack-name dcl-dev-stack-ops-s06 \\
  --logical-resource-id OpsInstance --query 'StackResourceDetail.PhysicalResourceId' --output text)

# 2. Consultar métricas de CPU en CloudWatch
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization \\
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \\
  --start-time $(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \\
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \\
  --period 300 --statistics Average

# 3. Consultar estado y configuración de la alarma
aws cloudwatch describe-alarms --alarm-names "dcl-dev-stack-ops-s06-cpu-high" \\
  --query 'MetricAlarms[0].{State:StateValue,Reason:StateReason,Datapoints:DatapointsToAlarm,Periods:EvaluationPeriods}'`,
        validation: "La gráfica muestra datapoints de CPUUtilization y un tramo elevado coherente con el user data. La alarma parte típicamente en INSUFFICIENT_DATA y, con dos períodos breaching disponibles, pasa a ALARM.",
        evidence: "Una sola gráfica donde sean legibles InstanceId, métrica, período y ventana temporal + detalle de la alarma con threshold y timestamp.",
        examTip: "Al inicio la alarma siempre estará en INSUFFICIENT_DATA: se necesitan acumular al menos 2 períodos completos de 5 minutos (10 minutos de datos)."
      },
      {
        num: "Prueba 5",
        title: "6. Prueba 5 — Explicar Causalidad (Reconstrucción de la Cadena)",
        what: "Reconstruir una cadena causal respaldada por evidencias independientes.",
        why: "La prueba central de S06 no es 'ver una alarma roja'. El equipo debe demostrar científicamente la causa observable.",
        subItems: [
          "Cadena de 6 Eslabones:",
          "1. User data: Template contiene dos procesos CPU-bound con timeout de 900 s.",
          "2. Carga CPU: Intervalo de CPUUtilization elevado en la instancia correcta.",
          "3. Datapoints: Métrica AWS/EC2 con período de 5 min.",
          "4. Threshold: Alarma configurada con Average >=70%.",
          "5. Evaluación: 2 datapoints de 2 períodos requeridos.",
          "6. Estado: Timestamp de transición/estado de la alarma coherente con la carga.",
          "Pregunta central: ¿Qué evidencia permite afirmar que la alarma fue causada por la carga controlada y no simplemente porque la alarma existe?"
        ],
        cliCommands: `# Consultar historial de cambios de estado de la alarma
aws cloudwatch describe-alarm-history --alarm-name "dcl-dev-stack-ops-s06-cpu-high" \\
  --history-item-type StateUpdate --max-items 3`,
        validation: "El equipo explica la causalidad con timestamps/períodos coherentes, no por coincidencia visual.",
        evidence: "Documentación de la cadena causal completa eslabón por eslabón.",
        examTip: "Una alarma declara una condición; no explica automáticamente la causa ni la salud del sistema. La evidencia exige conectar el UserData con la gráfica y la alarma."
      },
      {
        num: "Prueba 6",
        title: "Prueba 6 — Pequeño Cambio IaC (Update sin Reemplazo)",
        what: "Actualizar LabRevision de v1 a v2 usando el mismo template.",
        why: "Queremos demostrar estado deseado v1 → cambio declarativo → estado deseado v2 sin provocar replacement deliberado de EC2.",
        subItems: [
          "18. Antes del update, registren el InstanceId físico de OpsInstance.",
          "19. En CloudFormation, seleccionen Update stack > Use current template.",
          "20. Cambien únicamente LabRevision de v1 a v2 y revisen el resumen de cambios (Replacement: False).",
          "21. Ejecuten el update y esperen UPDATE_COMPLETE.",
          "22. Confirmen que el InstanceId de OpsInstance es el mismo y que el tag dcl:lab-revision refleja v2; la descripción/tag de la alarma también queda actualizado."
        ],
        cliCommands: `# 1. Registrar InstanceId antes del update
PREV_INSTANCE=$(aws cloudformation describe-stack-resource --stack-name dcl-dev-stack-ops-s06 \\
  --logical-resource-id OpsInstance --query 'StackResourceDetail.PhysicalResourceId' --output text)
echo "InstanceId previo: $PREV_INSTANCE"

# 2. Update stack pasando LabRevision=v2
aws cloudformation update-stack --stack-name dcl-dev-stack-ops-s06 \\
  --use-previous-template \\
  --parameters ParameterKey=VpcId,UsePreviousValue=true \\
               ParameterKey=SubnetId,UsePreviousValue=true \\
               ParameterKey=CpuThreshold,UsePreviousValue=true \\
               ParameterKey=LabRevision,ParameterValue=v2

aws cloudformation wait stack-update-complete --stack-name dcl-dev-stack-ops-s06

# 3. Comprobar que el InstanceId físico es exactamente el mismo
NEW_INSTANCE=$(aws cloudformation describe-stack-resource --stack-name dcl-dev-stack-ops-s06 \\
  --logical-resource-id OpsInstance --query 'StackResourceDetail.PhysicalResourceId' --output text)
echo "InstanceId tras update: $NEW_INSTANCE"`,
        validation: "UPDATE_COMPLETE y mismo physical ID para OpsInstance. El cambio afecta metadata/tags y no necesita reemplazar la instancia.",
        evidence: "UPDATE_COMPLETE + comparación del InstanceId antes/después + Revision=v2 en Outputs o tags.",
        examTip: "Si hubiéramos cambiado una propiedad destructiva (como la SubnetId), CloudFormation habría destruido la máquina y creado otra con un nuevo InstanceId."
      },
      {
        num: "Cleanup",
        title: "9. Cost Awareness y Cleanup Declarativo",
        what: "Eliminar el entorno completo mediante el mismo stack y restaurar el Baseline S01.",
        why: "El lab usa recursos temporales. CloudFormation no es una razón para mantener recursos activos después de obtener la evidencia.",
        subItems: [
          "CONSERVAR COMO BASELINE: VPC dcl-dev-vpc (10.20.0.0/16), dcl-dev-subnet-a (10.20.1.0/24) y dcl-dev-subnet-b (10.20.2.0/24) con sus dos AZ, naming/tags persistentes.",
          "23. En CloudFormation, seleccionar dcl-dev-stack-ops-s06 > Delete.",
          "24. Esperar a que el stack desaparezca de la vista de stacks activos.",
          "25. Verificar que OpsInstance terminó y que su root EBS ya no existe (DeleteOnTermination=true).",
          "26. Verificar que OpsSecurityGroup y CpuHighAlarm fueron eliminados por CloudFormation.",
          "27. No eliminar manualmente los recursos uno por uno salvo troubleshooting documentado de un DELETE_FAILED.",
          "28. Confirmar que VPC y ambas subnets del baseline S01 permanecen intactas."
        ],
        cliCommands: `# Eliminar stack completo de forma atómica
aws cloudformation delete-stack --stack-name dcl-dev-stack-ops-s06
aws cloudformation wait stack-delete-complete --stack-name dcl-dev-stack-ops-s06`,
        validation: "No quedan EC2, root EBS, SG ni alarm del stack S06. El baseline S01 permanece y no se creó conectividad pública.",
        evidence: "Validación de stack eliminado limpiamente.",
        examTip: "Regla del profesor: El cleanup se realiza con Delete stack y NO eliminando recursos manualmente uno por uno."
      }
    ],
    codeTitle: "Template Oficial CloudFormation (YAML del Lab 06)",
    codeLines: [
      { code: "AWSTemplateFormatVersion: '2010-09-09'", exp: "Versión oficial del formato de plantillas de AWS CloudFormation." },
      { code: "Parameters:", exp: "Declaración de parámetros configurables recibidos por el stack." },
      { code: "  AmiId: Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>", exp: "Resuelve dinámicamente la última AMI de Amazon Linux 2023 desde Systems Manager Parameter Store." },
      { code: "  CpuThreshold: { Type: Number, Default: 70 }", exp: "Umbral porcentual de utilización de CPU que evalúa la alarma." },
      { code: "  LabRevision: { Type: String, Default: v1, AllowedValues: [v1, v2] }", exp: "Parámetro utilizado para demostrar updates declarativos sin reemplazo de instancia." },
      { code: "Resources:", exp: "Sección de recursos administrados por la unidad declarativa." },
      { code: "  OpsSecurityGroup: Type: AWS::EC2::SecurityGroup", exp: "Security Group para la máquina temporal; sin reglas Inbound, salida por defecto." },
      { code: "  OpsInstance: Type: AWS::EC2::Instance", exp: "Instancia virtual EC2 de tipo t3.micro en Subnet A." },
      { code: "    Monitoring: false", exp: "CLAVE: Configura Basic Monitoring (publica métricas cada 5 minutos / 300 s sin costo)." },
      { code: "    AssociatePublicIpAddress: false", exp: "La instancia no expone IP pública ni requiere acceso a Internet." },
      { code: "    UserData: !Base64 |", exp: "Script ejecutado al inicio para saturar CPU de forma controlada sin paquetes externos:" },
      { code: "      for i in 1 2; do timeout 900 bash -c 'while :; do :; done' & done", exp: "Lanza 2 bucles infinitos durante 900 segundos (15 minutos) que consumen 100% de CPU y se apagan solos." },
      { code: "  CpuHighAlarm: Type: AWS::CloudWatch::Alarm", exp: "Alarma que supervisa la métrica CPUUtilization sobre la OpsInstance." },
      { code: "    Period: 300 | EvaluationPeriods: 2 | DatapointsToAlarm: 2", exp: "Exige que 2 períodos consecutivos de 300 s (5 min) superen el 70% para transicionar a ALARM." }
    ]
  },
  lab7: {
    title: "Laboratorio Evolutivo 07: Modernización de Digital Café Luna en AWS",
    badge: "Semana 7 · Cuenta AWS estándar · us-east-1",
    duration: "40 min hands-on · Equipos de 4 · Carácter formativo con evidencia",
    goal: "Demostrar que un workload corto y orientado a eventos puede ejecutarse sin administrar una VM dedicada, pero que la responsabilidad operacional no desaparece: cambia de frontera.",
    summary: "Al finalizar, el equipo habrá relacionado un objeto nuevo en S3 con una invocación de Lambda y un log verificable, y podrá comparar qué responsabilidades se transfieren a la plataforma y cuáles siguen perteneciendo al equipo.",
    diagram: [
      { icon: "📦", name: "Archivo Subido", sub: "incoming/order-001.json" },
      { icon: "🪣", name: "Bucket S3 (Productor)", sub: "Filtro: incoming/*.json" },
      { icon: "⚡", name: "AWS Lambda (Consumidor)", sub: "Python 3.14 · Sin VPC · ~2 ms" },
      { icon: "🪪", name: "Execution Role", sub: "Solo CloudWatch Logs (Sin S3)" },
      { icon: "📋", name: "CloudWatch Logs", sub: "/aws/lambda/... (Retención 1 día)" }
    ],
    // Glosario específico de este laboratorio
    labGlossaryTerms: [
      "Arquitectura Orientada a Eventos (Serverless)",
      "Execution Role vs Resource-based Policy",
      "Filtros de Notificación S3 (Prefix & Suffix)",
      "Log Group Precreado y Retención",
      "Garantía de Entrega At-Least-Once",
      "Baseline S01 (Infraestructura Base Persistente)"
    ],
    // Pasos oficiales desglosados tal cual el profesor
    steps: [
      {
        num: "Preflight",
        title: "2. Baseline y Preflight: Arquitectura Fuera de la VPC",
        what: "Confirmar Región, baseline persistente y permisos normales de la cuenta antes de crear recursos temporales.",
        why: "S07 moderniza la forma de ejecución; no necesita modificar red, subnets, routing ni conectividad solo porque los labs anteriores sí utilizaron la VPC.",
        subItems: [
          "1. Confirmen que la consola está en us-east-1 y registren Account ID para construir un nombre de bucket único.",
          "2. Confirmen que no existen recursos S07 de una ejecución anterior con los mismos nombres.",
          "3. La identidad de la consola debe poder usar S3, Lambda, IAM y CloudWatch Logs. No creen access keys como workaround.",
          "4. No modifiquen VPC, subnets, route tables, security groups ni conectividad del baseline (Uso de VPC en S07: Ninguno; se conserva intacta)."
        ],
        cliCommands: `# Verificar que la consola está en us-east-1 y registrar Account ID
aws sts get-caller-identity
aws configure get region`,
        validation: "Los recursos persistentes S01 están intactos y el equipo tiene nombres únicos definidos para S07.",
        evidence: "Baseline S01 intacto; nombres de recursos únicos listados.",
        examTip: "S07 usa una integración administrada fuera de la VPC: el baseline S01 permanece intacto y no forma parte del camino de ejecución."
      },
      {
        num: "Paso A y B",
        title: "3. Prueba 1 — Paso A y B: Bucket, Log Group y Execution Role Mínimo",
        what: "Crear el productor (S3), el log group precreado con retención de 1 día y el execution role mínimo en IAM.",
        why: "El log group se crea antes para evitar conceder logs:CreateLogGroup. La función no lee el objeto; por eso su execution role no necesita permisos S3.",
        subItems: [
          "Paso A — bucket y log group:",
          "5. En S3 creen un bucket General purpose privado en us-east-1 con nombre dcl-s07-teamXX-<account-id>. Mantengan Block Public Access habilitado.",
          "6. En CloudWatch > Log groups creen /aws/lambda/dcl-dev-order-event-s07 y configuren retención = 1 día.",
          "7. No carguen todavía incoming/order-001.json; primero completaremos la integración.",
          "Paso B — execution role mínimo:",
          "8. En IAM > Roles creen dcl-dev-role-lambda-s07 con trusted entity = AWS service y use case = Lambda.",
          "9. No adjunten políticas de S3. Agreguen una inline policy con solo dos acciones: logs:CreateLogStream y logs:PutLogEvents, acotada al log group precreado.",
          "OJO TÉCNICO: El log group se crea antes para evitar conceder logs:CreateLogGroup. La función no lee el objeto; por eso su execution role no necesita permisos S3."
        ],
        cliCommands: `# 1. Crear bucket S3 privado
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET="dcl-s07-team01-\${ACCOUNT_ID}"
aws s3api create-bucket --bucket "$BUCKET" --region us-east-1

# 2. Precrear Log Group en CloudWatch con retención de 1 día
aws logs create-log-group --log-group-name "/aws/lambda/dcl-dev-order-event-s07"
aws logs put-retention-policy --log-group-name "/aws/lambda/dcl-dev-order-event-s07" --retention-in-days 1

# 3. Crear rol IAM para Lambda sin permisos de S3
aws iam create-role --role-name dcl-dev-role-lambda-s07 \\
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

aws iam put-role-policy --role-name dcl-dev-role-lambda-s07 \\
  --policy-name LambdaLogPolicy \\
  --policy-document "{
    \\"Version\\": \\"2012-10-17\\",
    \\"Statement\\": [{
      \\"Effect\\": \\"Allow\\",
      \\"Action\\": [\\"logs:CreateLogStream\\", \\"logs:PutLogEvents\\"],
      \\"Resource\\": \\"arn:aws:logs:us-east-1:\${ACCOUNT_ID}:log-group:/aws/lambda/dcl-dev-order-event-s07:*\\"
    }]
  }"`,
        validation: "Log group creado con retención de 1 día; Execution Role creado con inline policy acotada sin permisos de S3.",
        evidence: "Configuración de retención de 1 día y política inline de IAM acotada a logging.",
        examTip: "Pregunta fija: '¿Por qué la función no tiene permisos de S3 en su rol?'. Porque Lambda no abre el archivo en S3; solo lee la metadata que S3 le inyecta en el payload del evento."
      },
      {
        num: "Paso C y D",
        title: "3. Prueba 1 — Paso C y D: Función Lambda y Trigger ObjectCreated",
        what: "Crear la función Lambda dcl-dev-order-event-s07 con Python 3.14/3.12, asociar el rol, desplegar el código y configurar el trigger S3 con filtros.",
        why: "La integración solo es demostrable si podemos reconstruir quién produce el evento, quién lo consume y dónde queda evidencia.",
        subItems: [
          "Paso C — función Lambda:",
          "10. En Lambda creen dcl-dev-order-event-s07 con runtime Python 3.14 (o 3.12), arquitectura x86_64 y Use an existing role = dcl-dev-role-lambda-s07.",
          "11. Reemplacen el código inicial por el bloque oficial y seleccionen Deploy. No se evalúa Python; el código solo registra metadata del evento.",
          "Paso D — configurar ObjectCreated:",
          "12. En la función Lambda, seleccionen Add trigger > S3.",
          "13. Bucket = el bucket S07 del equipo. Event type = All object create events (equivale a s3:ObjectCreated:*).",
          "14. Prefix = incoming/ y Suffix = .json.",
          "15. Confirmen que bucket y función están en us-east-1 y creen el trigger.",
          "16. En Configuration > Permissions validen que la resource-based policy de Lambda contiene permiso para que S3 invoque esta función desde el bucket del equipo.",
          "Regla crítica: La función no escribe objetos dentro de incoming/ ni en ningún prefijo que vuelva a disparar el mismo trigger. En este lab la función solo registra metadata."
        ],
        cliCommands: `# 1. Crear handler en Python
cat << 'EOF' > lambda_function.py
import json
import logging
from urllib.parse import unquote_plus

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    for record in event.get('Records', []):
        payload = {
            'bucket': record['s3']['bucket']['name'],
            'key': unquote_plus(record['s3']['object']['key']),
            'eventName': record.get('eventName'),
            'eventTime': record.get('eventTime'),
            'requestId': context.aws_request_id
        }
        logger.info(json.dumps(payload))
    return {'records': len(event.get('Records', []))}
EOF

zip function.zip lambda_function.py
aws lambda create-function --function-name dcl-dev-order-event-s07 \\
  --runtime python3.12 --role arn:aws:iam::\${ACCOUNT_ID}:role/dcl-dev-role-lambda-s07 \\
  --handler lambda_function.lambda_handler --zip-file fileb://function.zip

# 2. Configurar Resource-based policy de invocación entrante
aws lambda add-permission --function-name dcl-dev-order-event-s07 \\
  --statement-id s3-trigger-permission --action lambda:InvokeFunction \\
  --principal s3.amazonaws.com \\
  --source-arn arn:aws:s3:::\${BUCKET} --source-account \${ACCOUNT_ID}

# 3. Asociar notificación con filtro incoming/*.json
aws s3api put-bucket-notification-configuration --bucket "$BUCKET" \\
  --notification-configuration '{
    "LambdaFunctionConfigurations": [{
      "LambdaFunctionArn": "'$(aws lambda get-function --function-name dcl-dev-order-event-s07 --query Configuration.FunctionArn --output text)'",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {"Name": "prefix", "Value": "incoming/"},
            {"Name": "suffix", "Value": ".json"}
          ]
        }
      }
    }]
  }'`,
        validation: "El bucket permanece privado; el trigger solo aplica a incoming/*.json; la función usa el role mínimo; el baseline S01 no cambió.",
        evidence: "Trigger S3 configurado en la consola de Lambda y Resource-based policy visible en Permissions.",
        examTip: "Regla crítica: La función jamás debe escribir objetos dentro de 'incoming/' o se producirá un bucle infinito recursivo de auto-invocación."
      },
      {
        num: "Prueba 2 y 3",
        title: "4. Prueba 2 y 5. Prueba 3 — Producir el Evento y Demostrar Comportamiento",
        what: "Crear exactamente un objeto dentro del prefijo que activa la notificación y localizar la ejecución asociada en CloudWatch Logs.",
        why: "El comportamiento debe empezar en una condición observable del productor, no en una invocación manual de Lambda. La evidencia útil no es 'Lambda existe'; debe relacionar el mismo objeto con el evento, la invocación y el log.",
        subItems: [
          "Prueba 2: Creen localmente un archivo order-001.json con payload: {'orderId': 'order-001', 'source': 'lab-s07', 'action': 'created'} y súbanlo a incoming/order-001.json.",
          "Prueba 3:",
          "17. Abrir CloudWatch > Logs > Log groups > /aws/lambda/dcl-dev-order-event-s07.",
          "18. Abrir el log stream más reciente y localizar una línea JSON emitida por el código.",
          "19. Confirmar bucket, key=incoming/order-001.json, eventName y requestId/eventTime.",
          "20. Si el log tarda en aparecer, continúen con la comparación operacional y vuelvan a revisar. No cambien permisos sin evidencia.",
          "Nota técnica: Las notificaciones S3 se diseñan para entrega at-least-once. Una notificación duplicada ocasional no implica automáticamente que el lab falló."
        ],
        cliCommands: `# 1. Crear y subir payload del pedido
cat << 'EOF' > order-001.json
{
  "orderId": "order-001",
  "source": "lab-s07",
  "action": "created"
}
EOF

aws s3 cp order-001.json "s3://\${BUCKET}/incoming/order-001.json"

# 2. Consultar logs correlacionados en CloudWatch Logs
aws logs tail "/aws/lambda/dcl-dev-order-event-s07" --follow`,
        validation: "El objeto existe con key exacta incoming/order-001.json. Una misma evidencia permite reconstruir objeto → ObjectCreated → invocación → log.",
        evidence: "Log estructurado en CloudWatch con bucket, key='incoming/order-001.json', eventName y requestId coincidente.",
        examTip: "Regla de evidencia: Una captura de que la función Lambda existe no constituye evidencia suficiente. El lab exige objeto → evento → ejecución → log."
      },
      {
        num: "Prueba 4",
        title: "6. Prueba 4 — Comparación Operacional: Frontera de Responsabilidad",
        what: "Comparar esta reacción event-driven con una implementación equivalente que mantuviera una EC2 esperando eventos.",
        why: "Modernizar no significa escoger la tecnología más nueva; significa mover responsabilidades cuando las restricciones del workload lo justifican.",
        subItems: [
          "Completar la tabla de 9 dimensiones: Servidor, Sistema operativo, Runtime, Scaling/capacidad, Disponibilidad, IAM/permisos, Código, Logs/evidencia, Costo cuando no hay ejecución.",
          "Conclusión del equipo: ¿Qué responsabilidades fueron transferidas a la plataforma y cuáles siguen perteneciendo al equipo?",
          "Pregunta de decisión: Responder con una restricción, no con una etiqueta: ¿Qué restricción de este workload hace razonable usar Lambda en lugar de mantener una VM esperando eventos?",
          "Una respuesta sólida debería relacionar: ejecución corta, intermitencia, evento como disparador, ausencia de necesidad de control del sistema operativo y menor necesidad de administrar capacidad dedicada.",
          "'Porque es serverless' o 'porque es más moderno' no explica la decisión."
        ],
        cliCommands: `# Análisis conceptual para la sustentación oral frente al profesor`,
        validation: "El equipo explica con rigor qué responsabilidades se transfirieron a AWS (hardware, SO, escalado) y cuáles retiene el equipo (código, IAM, filtros, logs).",
        evidence: "Tabla comparativa completada y respuesta a la pregunta de decisión basada en restricciones técnicas.",
        examTip: "No escogemos VM, containers o serverless porque sean más modernos; los escogemos porque ciertas restricciones justifican sus responsabilidades y trade-offs."
      },
      {
        num: "Cleanup",
        title: "8. Cost Awareness y Cleanup Obligatorio de S07",
        what: "Eliminar todos los recursos temporales creados para S07 y certificar que el Baseline S01 permanece intacto.",
        why: "El lab usa recursos pequeños. No crea EC2, ALB, NAT Gateway, public IPv4, API Gateway, SQS ni SNS.",
        subItems: [
          "CONSERVAR COMO BASELINE: dcl-dev-vpc (10.20.0.0/16), dcl-dev-subnet-a y dcl-dev-subnet-b con sus AZ, naming/tags persistentes.",
          "21. Eliminar el trigger/event notification S3 asociado a Lambda.",
          "22. Eliminar dcl-dev-order-event-s07.",
          "23. Eliminar /aws/lambda/dcl-dev-order-event-s07.",
          "24. Vaciar el bucket, eliminar objetos accidentales y eliminar el bucket.",
          "25. Eliminar la inline policy del lab y después dcl-dev-role-lambda-s07.",
          "26. Verificar que no quedaron recursos S07 ni modificaciones sobre S01."
        ],
        cliCommands: `# Cleanup obligatorio de S07
aws s3api put-bucket-notification-configuration --bucket "$BUCKET" --notification-configuration '{}'
aws lambda delete-function --function-name dcl-dev-order-event-s07
aws logs delete-log-group --log-group-name "/aws/lambda/dcl-dev-order-event-s07"
aws s3 rm "s3://\${BUCKET}" --recursive
aws s3api delete-bucket --bucket "$BUCKET"
aws iam delete-role-policy --role-name dcl-dev-role-lambda-s07 --policy-name LambdaLogPolicy
aws iam delete-role --role-name dcl-dev-role-lambda-s07`,
        validation: "Validación de cleanup: bucket, Lambda, trigger, log group y role S07 ya no existen; el baseline S01 permanece intacto.",
        evidence: "Entorno desaprovisionado completamente sin residuos.",
        examTip: "Cierre técnico: Serverless elimina la necesidad de administrar una VM dedicada para esta reacción; no elimina IAM, código, eventos, logs ni costo."
      }
    ],
    codeTitle: "Handler de Lambda en Python y Rol IAM (Lab 07)",
    codeLines: [
      { code: 'import json, logging', exp: 'Librerías estándar de Python; no se requieren dependencias externas.' },
      { code: 'from urllib.parse import unquote_plus', exp: 'Decodifica caracteres URL-encoded en los nombres de archivo de S3 (ej. espacios o acentos).' },
      { code: 'def lambda_handler(event, context):', exp: 'Punto de entrada invocado por el runtime de Lambda al recibir la notificación de S3.' },
      { code: '  for record in event.get("Records", []):', exp: 'Itera sobre la lista de eventos incluidos en el batch de notificación de S3.' },
      { code: '    payload = {', exp: 'Construye el diccionario de metadata sin descargar el contenido del objeto:' },
      { code: '      "bucket": record["s3"]["bucket"]["name"],', exp: 'Extrae el nombre del bucket directamente del cuerpo del evento.' },
      { code: '      "key": unquote_plus(record["s3"]["object"]["key"]),', exp: 'Extrae la clave del objeto (incoming/order-001.json) decodificada.' },
      { code: '      "eventName": record.get("eventName"),', exp: 'Registra el tipo de evento exacto, por ejemplo "ObjectCreated:Put".' },
      { code: '      "requestId": context.aws_request_id', exp: 'Correlaciona este log con los registros START, END y REPORT de CloudWatch.' },
      { code: '    }', exp: 'Cierre del payload estructurado.' },
      { code: '    logger.info(json.dumps(payload))', exp: 'Emite el log hacia CloudWatch Logs usando los privilegios del Execution Role.' }
    ]
  }
};

// =============================================================================
// 3. BASE DE DATOS DE SIMULACIÓN Y DIAGNÓSTICO (OFICIAL DE LOS 3 LABS)
// =============================================================================
const scenariosData = [
  {
    id: "sc1",
    lab: "Lab 05 · Red vs Autorización",
    title: "¿Qué ocurre si Subnet A carece de Internet Gateway o ruta 0.0.0.0/0?",
    symptom: "El comando 'aws s3api get-object' sobre 'allowed/context.txt' se queda colgado indefinidamente y termina en error.",
    terminalOutput: `$ aws s3api get-object --bucket dcl-s05-team01 --key allowed/context.txt /tmp/out.txt\n\nConnect timeout on endpoint URL: "https://dcl-s05-team01.s3.us-east-1.amazonaws.com/allowed/context.txt"\nCould not connect to the endpoint URL`,
    cause: "Fallo de REACHABILITY (Conectividad de Red), NO de políticas IAM.",
    explanation: "Para que el motor de IAM evalúe los permisos de la petición, el paquete TCP debe alcanzar primero el endpoint público de Amazon S3. Sin Internet Gateway o ruta de salida por defecto en la tabla de rutas, la solicitud muere por Timeout antes de llegar al servicio.",
    checkFirst: "Verificar la Route Table asociada a Subnet A (0.0.0.0/0 -> IGW), asignación de Public IPv4 y reglas Outbound del Security Group."
  },
  {
    id: "sc2",
    lab: "Lab 05 · Identidad",
    title: "¿Qué ocurre si se lanza la EC2 sin asociarle el IAM Instance Profile?",
    symptom: "Desde la terminal de la EC2, cualquier comando de AWS CLI hacia S3 o STS falla de inmediato indicando falta de credenciales.",
    terminalOutput: `$ aws s3api get-object --bucket dcl-s05-team01 --key allowed/context.txt /tmp/out.txt\n\nUnable to locate credentials. You can configure credentials by running "aws configure".`,
    cause: "Fallo de IDENTITY (Ausencia de credenciales temporales del Instance Profile).",
    explanation: "Al no usar credenciales estáticas en disco ('aws configure'), la CLI busca credenciales temporales en el Instance Metadata Service (IMDS). Al no tener un Instance Profile vinculado, la máquina carece de identidad con la cual autenticarse.",
    checkFirst: "Verificar en los detalles de la instancia EC2 que el campo IAM Role tenga 'dcl-dev-role-s05' y validar con 'aws sts get-caller-identity'."
  },
  {
    id: "sc3",
    lab: "Lab 05 · Autorización (Resource)",
    title: "¿Por qué 'restricted/secret.txt' da AccessDenied con el mismo rol?",
    symptom: "El comando 'get-object' en 'allowed/context.txt' funciona, pero falla en 'restricted/secret.txt'.",
    terminalOutput: `$ aws s3api get-object --bucket dcl-s05-team01 --key restricted/secret.txt /tmp/sec.txt\nAn error occurred (AccessDenied) when calling the GetObject operation: Access Denied`,
    cause: "Decisión de AUTHORIZATION por alcance de Resource.",
    explanation: "La red y la identidad son válidas, y el archivo SÍ existe en el bucket. El rechazo ocurre porque la política IAM limita el elemento Resource estrictamente a 'arn:aws:s3:::.../allowed/*'. Al pedir 'restricted/secret.txt', el recurso queda fuera de la autorización.",
    checkFirst: "Comportamiento esperado que demuestra least privilege: Reachability no implica Authorization."
  },
  {
    id: "sc4",
    lab: "Lab 05 · Autorización (Action)",
    title: "¿Por qué 'put-object' en 'allowed/' da AccessDenied si el recurso está permitido?",
    symptom: "La descarga en 'allowed/' funciona pero la subida de un archivo nuevo en 'allowed/' falla con AccessDenied.",
    terminalOutput: `$ aws s3api put-object --bucket dcl-s05-team01 --key allowed/write-test.txt --body /tmp/test.txt\nAn error occurred (AccessDenied) when calling the PutObject operation: Access Denied`,
    cause: "Decisión de AUTHORIZATION por omisión de Action (Implicit Deny).",
    explanation: "El Resource sí coincide con 'allowed/*', pero la política IAM únicamente autorizó 's3:GetObject'. En IAM todo lo no permitido explícitamente se niega por defecto (Implicit Deny). La acción 's3:PutObject' es rechazada.",
    checkFirst: "Comportamiento esperado. Demuestra que tener permiso sobre un Resource no concede todas las Actions sobre él."
  },
  {
    id: "sc5",
    lab: "Lab 06 · Observabilidad CloudFormation",
    title: "¿Por qué la alarma muestra INSUFFICIENT_DATA recién creado el Stack (Minuto 2)?",
    symptom: "El stack finaliza en CREATE_COMPLETE y la instancia está 'running', pero la alarma no pasa a ALARM de inmediato.",
    terminalOutput: `CloudFormation Stack Status: CREATE_COMPLETE\nEC2 Instance State: running (i-0123456789abcdef0)\nCloudWatch Alarm State: INSUFFICIENT_DATA\nDatapoints available: 0 of 2 required (Period: 300s)`,
    cause: "Ventana de agregación de Basic Monitoring (No constituye un error de despliegue).",
    explanation: "Con Basic Monitoring ('Monitoring: false'), EC2 publica métricas cada 5 minutos (300 s). La alarma exige 2 períodos de evaluación (10 minutos de datos). En los primeros minutos es técnicamente imposible que existan los datapoints requeridos.",
    checkFirst: "Diferenciar entre tiempo de despliegue de infraestructura y ventana temporal de observación de métricas (esperar 15-25 min)."
  },
  {
    id: "sc6",
    lab: "Lab 06 · Ciclo de Vida IaC",
    title: "¿Qué ocurre si en un Update Stack se altera una propiedad inmutable (ej. SubnetId)?",
    symptom: "En el resumen de cambios (Change Set Preview) se advierte 'Replacement: True' sobre la instancia EC2.",
    terminalOutput: `Change Set Preview:\nAction: Modify | Logical ID: OpsInstance | Resource Type: AWS::EC2::Instance | Replacement: True\n\nResult: Instancia original terminada -> Nueva instancia creada con diferente Physical ID.`,
    cause: "Modificación que requiere REPLACEMENT (Reemplazo destructivo del recurso).",
    explanation: "Cambiar tags es una modificación no destructiva in-place (Replacement: False, conserva el mismo InstanceId). Modificar la subred o la AMI fuerza a CloudFormation a destruir la máquina existente y crear una nueva con un InstanceId físico diferente.",
    checkFirst: "Revisar siempre la columna 'Replacement' en el Change Set antes de confirmar actualizaciones críticas en producción."
  },
  {
    id: "sc7",
    lab: "Lab 07 · Filtros de Eventos S3",
    title: "¿Qué ocurre si se sube 'order-001.json' en la raíz del bucket en vez de 'incoming/'?",
    symptom: "El archivo existe en el bucket de S3, pero la función Lambda registra 0 invocaciones y ningún log en CloudWatch.",
    terminalOutput: `S3 Object Key: s3://dcl-s07-team01/order-001.json\nConfigured Trigger Filter: Prefix="incoming/" | Suffix=".json"\nTrigger Status: NO_MATCH -> Invocations: 0`,
    cause: "El objeto no satisface los filtros de notificación definidos en el productor de eventos (S3).",
    explanation: "S3 evalúa la clave completa del objeto. Al no comenzar por el prefijo 'incoming/', la notificación no se genera, protegiendo a la función de procesar archivos no autorizados.",
    checkFirst: "Verificar la ruta exacta del objeto ('incoming/order-001.json') y la coincidencia de mayúsculas/minúsculas."
  },
  {
    id: "sc8",
    lab: "Lab 07 · Bucles de Recursión Infinita",
    title: "¿Qué ocurre si la función Lambda guarda un archivo '.json' dentro de 'incoming/'?",
    symptom: "Se sube un único archivo y en pocos segundos se disparan miles de invocaciones descontroladas de Lambda.",
    terminalOutput: `Upload: incoming/order.json -> Triggers Lambda #1\nLambda #1 writes: incoming/result.json -> Triggers Lambda #2\nLambda #2 writes: incoming/result_2.json -> Triggers Lambda #3...\nCRITICAL WARNING: Recursive Event Loop Detected!`,
    cause: "Bucle de invocación recursiva por falta de aislamiento entre entrada y salida.",
    explanation: "Si el consumidor escribe en el mismo prefijo que supervisa el disparador, cada ejecución produce un nuevo evento, generando un ciclo infinito de invocaciones y costos imprevistos.",
    checkFirst: "Separar estrictamente las rutas de entrada (prefijo incoming/) y salida (prefijo processed/ o bucket independiente)."
  }
];

// =============================================================================
// 4. BANCO DE PREGUNTAS TIPO TEST OFICIAL (12 PREGUNTAS)
// =============================================================================
const quizQuestions = [
  {
    id: 1,
    topic: "S05",
    badge: "IAM & S3 · Mínimo Privilegio",
    question: "Una instancia EC2 utiliza un IAM Role cuya única política autoriza 's3:GetObject' sobre 'arn:aws:s3:::empresa-datos/publico/*'. Desde la terminal, el comando para descargar 'publico/info.txt' finaliza exitosamente (HTTP 200), pero inmediatamente después el comando para descargar 'confidencial/nomina.txt' (archivo existente en el bucket) arroja 'AccessDenied'. ¿Cuál es la causa técnica de este comportamiento?",
    options: {
      A: "La instancia EC2 perdió conectividad con el endpoint de S3 debido a que el Security Group bloqueó la salida hacia el prefijo confidencial.",
      B: "El cifrado por defecto SSE-S3 del bucket impide que las instancias EC2 desencripten objetos ubicados fuera del prefijo público.",
      C: "La conectividad de red y la identidad son válidas, pero el ARN del objeto solicitado no coincide con el recurso definido en el elemento Resource de la política IAM."
    },
    correct: "C",
    explanation: "Correcto. Dado que la primera descarga funcionó segundos antes desde la misma máquina, se comprueba que Reachability (red) e Identity (rol) operan correctamente. La denegación obedece a una decisión de Authorization: el recurso solicitado queda fuera del alcance 'publico/*'."
  },
  {
    id: 2,
    topic: "S05",
    badge: "IAM · Action vs Resource",
    question: "Bajo la misma política del caso anterior (que autoriza únicamente 's3:GetObject' en '.../publico/*'), un usuario intenta subir un archivo nuevo hacia 'publico/reporte.txt' usando la operación PutObject y recibe 'AccessDenied'. ¿Qué principio explica esta respuesta?",
    options: {
      A: "Aunque el recurso coincide con el prefijo autorizado, la acción 's3:PutObject' no fue otorgada en la política y en IAM todo lo no permitido explícitamente se deniega por defecto (Implicit Deny).",
      B: "Las instancias EC2 asociadas a un Instance Profile solo pueden realizar operaciones de lectura en Amazon S3.",
      C: "La configuración de Block Public Access del bucket bloquea automáticamente escrituras en carpetas denominadas 'publico/'."
    },
    correct: "A",
    explanation: "Exacto. El elemento Resource coincide, pero en IAM rige el principio de denegación implícita por defecto. Al no haberse concedido la acción 's3:PutObject', la solicitud es rechazada."
  },
  {
    id: 3,
    topic: "S05",
    badge: "Diagnóstico · Red vs IAM",
    question: "Al ejecutar 'aws s3api get-object' desde una instancia EC2, la terminal no devuelve el archivo ni arroja 'AccessDenied', sino que permanece a la espera durante 20 segundos y devuelve 'Could not connect to the endpoint URL'. ¿Cuál es el diagnóstico certero?",
    options: {
      A: "La política IAM contiene una sentencia Deny explícita que oculta el error de autorización por motivos de seguridad.",
      B: "Existe una falla de Reachability (como ausencia de ruta hacia un Internet Gateway o restricción de salida en la subred), impidiendo que los paquetes alcancen el servicio S3.",
      C: "El objeto solicitado fue eliminado del bucket de S3 instantes antes de la ejecución."
    },
    correct: "B",
    explanation: "Correcto. Los errores de timeout o 'Could not connect' son indicativos inequívocos de fallas en la capa de red (enrutamiento, IGW o Security Groups salientes), ocurriendo antes de que la petición llegue a IAM."
  },
  {
    id: 4,
    topic: "S05",
    badge: "Auditoría · CloudTrail",
    question: "Durante una revisión en 'CloudTrail Event history', un auditor localiza el evento 'AttachRolePolicy' pero no encuentra registros de las operaciones 'GetObject' y 'PutObject' ejecutadas sobre los archivos del bucket. ¿Por qué ocurre esto?",
    options: {
      A: "CloudTrail Event history almacena por defecto únicamente Management Events (plano de control) y no incluye Data Events (plano de datos) de objetos S3 sin configuración de un trail específico.",
      B: "Los accesos a S3 solo se auditan en CloudTrail cuando el bucket tiene desactivado el cifrado SSE-S3.",
      C: "Las solicitudes originadas por credenciales temporales de IAM no generan trazas de auditoría en AWS."
    },
    correct: "A",
    explanation: "Correcto. 'AttachRolePolicy' modifica la configuración de infraestructura (Management Event). Las lecturas y escrituras de archivos en S3 son Data Events y requieren configuración expresa debido al alto volumen de operaciones."
  },
  {
    id: 5,
    topic: "S06",
    badge: "IaC · Ciclo de Vida y Updates",
    question: "Se ejecuta un 'Update Stack' en CloudFormation modificando únicamente el parámetro 'LabRevision' de 'v1' a 'v2', el cual actualiza los Tags de la instancia EC2. Al concluir el estado UPDATE_COMPLETE, ¿qué ocurre con la máquina virtual?",
    options: {
      A: "CloudFormation destruye la instancia existente y aprovisiona una nueva con un InstanceId físico diferente.",
      B: "CloudFormation actualiza los metadatos de forma no destructiva in-place, conservando exactamente el mismo InstanceId físico.",
      C: "La instancia se reinicia automáticamente para volver a ejecutar el script de UserData con la nueva revisión."
    },
    correct: "B",
    explanation: "Correcto. La modificación de tags es una actualización sin reemplazo (Replacement: False). CloudFormation aplica el cambio preservando el recurso físico existente."
  },
  {
    id: 6,
    topic: "S06",
    badge: "CloudWatch · Ventanas de Alarma",
    question: "En un template con 'Monitoring: false' (Basic Monitoring de 5 minutos), una alarma sobre 'CPUUtilization' está configurada con Period=300, EvaluationPeriods=2 y DatapointsToAlarm=2. ¿Por qué el UserData ejecuta la carga durante 15 minutos en vez de solo 2 minutos?",
    options: {
      A: "Porque las instancias EC2 sin IP pública requieren 15 minutos para sincronizar su reloj con el hipervisor.",
      B: "Porque con Basic Monitoring los datapoints se publican cada 5 minutos y la alarma requiere acumular al menos 2 períodos completos con promedio superior al umbral.",
      C: "Porque CloudFormation suspende la recolección de métricas durante los primeros 15 minutos tras el despliegue."
    },
    correct: "B",
    explanation: "Exacto. Cada datapoint representa un intervalo consolidado de 5 minutos (300 s). Para satisfacer la regla '2 de 2 períodos', se requiere sostener la carga el tiempo suficiente para completar dos bloques íntegros."
  },
  {
    id: 7,
    topic: "S06",
    badge: "IaC · Despliegue vs Observación",
    question: "A los dos minutos de crear un stack con una EC2 y una alarma de CloudWatch, CloudFormation reporta 'CREATE_COMPLETE', pero la alarma en la consola figura en estado 'INSUFFICIENT_DATA'. ¿Qué conclusión técnica es la adecuada?",
    options: {
      A: "El despliegue falló internamente y se debe recrear la alarma manualmente desde CloudWatch.",
      B: "CREATE_COMPLETE valida que los recursos físicos existen; el estado INSUFFICIENT_DATA es el comportamiento normal mientras transcurre el tiempo necesario para emitir los datapoints de métrica.",
      C: "La alarma se encuentra bloqueada porque la propiedad ActionsEnabled está fijada en false."
    },
    correct: "B",
    explanation: "Correcto. El estado de CloudFormation atestigua la existencia física de los componentes, mientras que el estado de la alarma refleja la disponibilidad temporal de métricas para su cálculo matemático."
  },
  {
    id: 8,
    topic: "S06",
    badge: "IaC · Operación y Cleanup",
    question: "Finalizada una sesión de pruebas con un stack de CloudFormation que contiene una instancia EC2, un Security Group y una alarma, ¿cuál es el procedimiento formal para desaprovisionar el entorno?",
    options: {
      A: "Terminar manualmente la instancia EC2 desde la consola y dejar el stack en estado activo.",
      B: "Ejecutar la operación 'Delete Stack' en CloudFormation para que el orquestador elimine de forma ordenada todos los recursos declarados.",
      C: "Eliminar la VPC del baseline para forzar la caída de todos los recursos hijos."
    },
    correct: "B",
    explanation: "Correcto. Todo recurso gestionado como una unidad declarativa de infraestructura como código debe ser destruido a través del ciclo de vida del propio stack con 'Delete Stack'."
  },
  {
    id: 9,
    topic: "S07",
    badge: "Serverless · Permisos de Lambda",
    question: "Una función Lambda procesa eventos de S3 ('incoming/*.json') y registra el nombre del archivo en CloudWatch Logs. El Execution Role de la función NO cuenta con ningún permiso de S3 ('s3:GetObject'). ¿Por qué la función opera correctamente?",
    options: {
      A: "Porque Lambda y S3 en la misma región omiten automáticamente las restricciones de IAM.",
      B: "Porque la función no lee el contenido del archivo desde S3; extrae los metadatos (bucket y key) directamente del objeto de evento inyectado por S3 al invocarla.",
      C: "Porque el servicio CloudWatch Logs consulta el archivo S3 en nombre de la función."
    },
    correct: "B",
    explanation: "Correcto. Al tratarse de una arquitectura orientada a eventos, el payload del trigger ya contiene las propiedades del objeto creado. Al no invocar s3:GetObject, el rol no requiere permisos sobre el almacenamiento."
  },
  {
    id: 10,
    topic: "S07",
    badge: "Seguridad · Modelo de Permisos Lambda",
    question: "En la integración S3 -> Lambda -> CloudWatch Logs, se utilizan dos tipos de permisos con orientaciones distintas. ¿Cuál es la función precisa de cada uno?",
    options: {
      A: "La Resource-based policy de Lambda autoriza a S3 para invocar la función; el Execution Role de Lambda autoriza a la función para escribir eventos en CloudWatch Logs.",
      B: "El Execution Role autoriza a S3 a depositar archivos; la Resource-based policy autoriza a CloudWatch a leerlos.",
      C: "Ambas políticas cumplen propósitos redundantes para prevenir fallos en IAM."
    },
    correct: "A",
    explanation: "Exacto. La Resource-based policy regula el acceso entrante (quién puede invocar el recurso Lambda) y el Execution Role otorga los privilegios salientes que asume el código en tiempo de ejecución."
  },
  {
    id: 11,
    topic: "S07",
    badge: "Triggers · Reglas de Filtro",
    question: "Un trigger de S3 está configurado con Prefix='incoming/' y Suffix='.json'. Un usuario carga el archivo 'incoming/pedido.txt'. Al consultar CloudWatch Logs, no se observa ninguna invocación. ¿Qué explica este resultado?",
    options: {
      A: "La función Lambda requiere estar vinculada a una subred privada para procesar extensiones de texto.",
      B: "El archivo cumple el prefijo requerido pero no satisface el sufijo '.json', por lo que el productor de eventos (S3) no emite la notificación hacia Lambda.",
      C: "CloudWatch Logs descarta automáticamente eventos asociados a archivos con formato distinto a JSON."
    },
    correct: "B",
    explanation: "Correcto. Los filtros de notificación en S3 operan como una condición lógica AND. Al no coincidir el sufijo, el evento no se produce."
  },
  {
    id: 12,
    topic: "S07",
    badge: "Arquitectura · Frontera Operacional",
    question: "Al sustituir una máquina virtual EC2 encendida continuamente por una función AWS Lambda activada por eventos de S3, ¿cuál es el impacto sobre la responsabilidad operacional del equipo?",
    options: {
      A: "La responsabilidad operacional desaparece por completo, asumiendo AWS la totalidad de las tareas técnicas y de seguridad.",
      B: "La responsabilidad cambia de frontera: AWS asume el mantenimiento del servidor, sistema operativo y escalado; el equipo retiene la responsabilidad sobre el código, filtros de eventos, permisos IAM y control de costos.",
      C: "La responsabilidad permanece idéntica a la de una instancia EC2, debiendo aplicar parches al sistema operativo subyacente de la función."
    },
    correct: "B",
    explanation: "Correcto. En Serverless la responsabilidad operacional no desaparece, sino que se traslada hacia un nivel de abstracción superior enfocado en lógica de negocio, gobernanza de IAM y observabilidad."
  }
];

// =============================================================================
// 5. TARJETAS DE SUSTENTACIÓN Y DEFENSAS ORALES (FLASHCARDS 3D)
// =============================================================================
const flashcardsData = [
  {
    lab: "Sustentación · Lab 05",
    question: "¿Qué evidencia concreta permite afirmar que el AccessDenied en 'restricted/secret.txt' fue una decisión de autorización (IAM) y NO un problema de red ni un archivo inexistente?",
    answer: "Se demuestran 4 evidencias formales conectadas: 1) 'restricted/secret.txt' existe previamente en el bucket comprobado por la cuenta administradora (descarta NoSuchKey). 2) Desde la misma EC2 e instante, 'get-object' en 'allowed/context.txt' dio PASS con HTTP 200 (reachability y DNS confirmados). 3) 'get-caller-identity' confirma el rol 'dcl-dev-role-s05' (identidad confirmada). 4) La política IAM restringe el elemento Resource a 'allowed/*'. No hace falta abrir permisos para diagnosticar."
  },
  {
    lab: "Sustentación · Lab 05",
    question: "¿Por qué verificar que el bucket tiene cifrado SSE-S3 activo no constituye una evidencia de autorización en IAM?",
    answer: "Porque resuelven dominios técnicos disjuntos: el cifrado en reposo (SSE-S3) protege los bloques de datos almacenados físicamente en los discos de AWS (Data at Rest). La autorización de IAM evalúa las acciones permitidas a una identidad. Si la identidad tiene permiso s3:GetObject en IAM, S3 desencripta el archivo con SSE-S3 de forma transparente sin intervención del usuario."
  },
  {
    lab: "Sustentación · Lab 06",
    question: "¿Qué evidencia permite afirmar que la alarma en CloudWatch fue causada por nuestra carga controlada y no simplemente porque 'la alarma existe'?",
    answer: "La reconstrucción de la cadena causal completa: 1) El UserData en el YAML declara dos procesos CPU-bound con timeout 900 s. 2) La gráfica de 'CPUUtilization' del mismo InstanceId registra la subida al 100% en ese intervalo. 3) Dos datapoints consecutivos de 5 min superan el umbral >=70%. 4) El timestamp de transición a estado ALARM coincide exactamente con el cierre del segundo período de evaluación."
  },
  {
    lab: "Sustentación · Lab 06",
    question: "¿Cómo se distingue con evidencia técnica un problema de despliegue de un problema de observación en CloudFormation?",
    answer: "Un problema de despliegue se evidencia en la pestaña Events de CloudFormation (ej. ROLLBACK_IN_PROGRESS por parámetros inválidos, falta de cuotas o permisos insuficientes) y los recursos físicos no se completan. Un problema de observación ocurre cuando el stack ya está en CREATE_COMPLETE y la EC2 'running', pero se consulta el InstanceId equivocado, la región incorrecta o no se aguarda la ventana de 5 minutos del Basic Monitoring."
  },
  {
    lab: "Sustentación · Lab 07",
    question: "Responder con una restricción y no con una etiqueta: ¿Qué restricción de este workload hace razonable usar Lambda en vez de una VM (EC2) esperando eventos?",
    answer: "La justificación se basa en restricciones del workload: ejecución ultracorta (~2 ms), altamente intermitente (reacción ante eventos esporádicos de S3), ausencia de necesidad de control sobre el sistema operativo y menor necesidad de administrar capacidad dedicada. Una instancia EC2 incurriría en cobro 24/7 por capacidad ociosa y mantenimiento de parches, mientras que Lambda cobra $0.00 en inactividad."
  },
  {
    lab: "Sustentación · Lab 07",
    question: "¿Cuál es el fundamento arquitectónico de precrear el Log Group en CloudWatch antes de desplegar la función Lambda?",
    answer: "Alineación con el mínimo privilegio y control de costos: al precrear el grupo '/aws/lambda/dcl-dev-order-event-s07' con retención de 1 día, se previene acumulación perpetua de costos por almacenamiento de logs, y se evita otorgar a la función el permiso amplio 'logs:CreateLogGroup', acotando su Execution Role estrictamente a 'CreateLogStream' y 'PutLogEvents' sobre ese grupo exacto."
  }
];

// =============================================================================
// GESTOR DE ESTADO Y CONTROLADORES DE INTERFAZ
// =============================================================================
let currentLab = 'lab5';
let selectedCodeLine = null;
let activeScenarioId = 'sc1';
let currentQuizTopic = 'ALL';
let currentQuestionIndex = 0;
let userQuizAnswers = {};

// 1. Navegación entre Pestañas Principales
function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));

  const targetPane = document.getElementById('pane-' + tabId);
  const targetBtn = document.getElementById('tab-' + tabId);

  if (targetPane) targetPane.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');
}

// 2. Glosario: Filtros Rápidos sobre el DOM
let currentGlossaryFilter = 'all';
let currentGlossarySearch = '';

function filterGlossary(lab, btn) {
  currentGlossaryFilter = lab;
  document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyGlossaryFilters();
}

function searchGlossary(val) {
  currentGlossarySearch = val;
  applyGlossaryFilters();
}

function applyGlossaryFilters() {
  const cards = document.querySelectorAll('#glossary-cards-grid .glossary-card');
  const query = currentGlossarySearch.toLowerCase().trim();
  cards.forEach(card => {
    const cardLab = card.dataset.lab || '';
    const matchesLab = (currentGlossaryFilter === 'all' || cardLab === currentGlossaryFilter);
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
    card.style.display = (matchesLab && matchesQuery) ? 'flex' : 'none';
  });
}

// 3. Laboratorios: Pestañas de Laboratorio (S05 · S06 · S07)
function selectLab(labKey) {
  currentLab = labKey;
  document.querySelectorAll('.lab-choice-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById('btn-' + labKey);
  if (activeBtn) activeBtn.classList.add('active');

  ['lab5', 'lab6', 'lab7'].forEach(key => {
    const pane = document.getElementById('lab-view-' + key);
    if (pane) {
      pane.style.display = (key === labKey) ? 'block' : 'none';
    }
  });
}

function toggleStep(index) {
  const card = document.getElementById(`step-card-${currentLab}-${index}`) || document.getElementById(`step-card-${index}`);
  if (card && 'open' in card) {
    card.open = !card.open;
  }
}

function toggleAllSteps(expand, labKey) {
  const targetKey = labKey || currentLab;
  const container = document.getElementById('steps-container-' + targetKey) || document.getElementById('steps-container');
  if (container) {
    container.querySelectorAll('details.step-card').forEach(card => {
      card.open = expand;
    });
  }
}

function toggleLabGlossary() {
  const body = document.getElementById('lab-glossary-body');
  const icon = document.getElementById('lab-glossary-toggle-icon');
  if (body) {
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

function inspectCodeLine(index, labKey) {
  const k = labKey || currentLab;
  document.querySelectorAll(`#lab-view-${k} .code-inspect-line`).forEach(l => l.classList.remove('selected'));
  const target = document.getElementById(`inspect-line-${k}-${index}`) || document.getElementById(`inspect-line-${index}`);
  if (target) target.classList.add('selected');

  const lab = labsData[k];
  const outBox = document.getElementById(`inspector-output-box-${k}`) || document.getElementById('inspector-output-box');
  if (lab && lab.codeLines && lab.codeLines[index] && outBox) {
    outBox.innerHTML = `<strong>Línea ${index + 1}:</strong> ${escapeHtml(lab.codeLines[index].exp)}`;
  }
}

function copySnippet(btn, codeId) {
  const id = String(codeId).startsWith('cli-code-') ? codeId : `cli-code-${codeId}`;
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.textContent.trim();

  const handleSuccess = () => {
    const orig = btn.textContent;
    btn.textContent = '¡Copiado! ✓';
    btn.style.color = 'var(--accent-emerald)';
    btn.style.borderColor = 'var(--accent-emerald)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(handleSuccess).catch(() => fallbackCopy(text, handleSuccess));
  } else {
    fallbackCopy(text, handleSuccess);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    cb();
  } catch (err) {}
  document.body.removeChild(ta);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 4. Simulador de Diagnóstico
function selectScenario(id) {
  activeScenarioId = id;
  document.querySelectorAll('.scenario-card-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('btn-scenario-' + id);
  if (btn) btn.classList.add('active');

  const cur = scenariosData.find(s => s.id === id);
  if (!cur) return;

  const titleEl = document.getElementById('sim-console-title');
  if (titleEl) titleEl.textContent = `Diagnóstico de Incidentes AWS · ${cur.lab}`;

  const h3El = document.getElementById('sim-title');
  if (h3El) h3El.textContent = cur.title;

  const symEl = document.getElementById('sim-symptom');
  if (symEl) symEl.innerHTML = `<strong>Síntoma reportado:</strong> ${escapeHtml(cur.symptom)}`;

  const termEl = document.getElementById('sim-terminal');
  if (termEl) termEl.textContent = cur.terminalOutput;

  const causeEl = document.getElementById('sim-cause');
  if (causeEl) causeEl.textContent = cur.cause;

  const expEl = document.getElementById('sim-explanation');
  if (expEl) expEl.textContent = cur.explanation;

  const checkEl = document.getElementById('sim-checklist');
  if (checkEl) checkEl.textContent = cur.checkFirst;
}

// 5. Simulador de Examen Oficial
function getFilteredQuizList() {
  if (currentQuizTopic === 'ALL') return quizQuestions;
  return quizQuestions.filter(q => q.topic === currentQuizTopic);
}

function setQuizFilter(topic, btn) {
  currentQuizTopic = topic;
  currentQuestionIndex = 0;
  document.querySelectorAll('.filter-pill-btn[data-topic]').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderQuiz();
}

function updateQuizScore() {
  let score = 0;
  quizQuestions.forEach(q => {
    if (userQuizAnswers[q.id] === q.correct) score++;
  });
  const el = document.getElementById('quiz-score-num');
  if (el) el.textContent = `${score} / ${quizQuestions.length}`;
}

function renderQuiz() {
  const list = getFilteredQuizList();
  if (currentQuestionIndex >= list.length) currentQuestionIndex = 0;
  const q = list[currentQuestionIndex];
  if (!q) return;

  updateQuizScore();

  const progEl = document.getElementById('quiz-progress-label');
  if (progEl) progEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${list.length}`;

  const badgeEl = document.getElementById('quiz-badge');
  if (badgeEl) {
    badgeEl.className = `lab-badge ${q.topic.toLowerCase()}`;
    badgeEl.textContent = q.badge;
  }

  const qnumEl = document.getElementById('quiz-qnum');
  if (qnumEl) qnumEl.textContent = `Pregunta #${q.id}`;

  const qtextEl = document.getElementById('quiz-qtext');
  if (qtextEl) qtextEl.textContent = q.question;

  const sel = userQuizAnswers[q.id];

  const wrap = document.getElementById('quiz-options-wrap');
  if (wrap) {
    wrap.innerHTML = ['A', 'B', 'C'].map(letter => {
      let stateClass = '';
      if (sel) {
        if (letter === q.correct) stateClass = 'correct';
        else if (letter === sel) stateClass = 'wrong';
        else stateClass = 'dimmed';
      }
      return `
        <button onclick="answerQuiz(${q.id}, '${letter}')" class="quiz-option-btn ${stateClass}" ${sel ? 'disabled' : ''}>
          <span class="option-letter-badge">${letter}</span>
          <span>${escapeHtml(q.options[letter])}</span>
        </button>
      `;
    }).join('');
  }

  const feedbackWrap = document.getElementById('quiz-feedback-wrap');
  if (feedbackWrap) {
    if (sel) {
      feedbackWrap.style.display = 'block';
      feedbackWrap.className = `quiz-feedback-box ${sel === q.correct ? 'correct' : 'incorrect'}`;
      feedbackWrap.innerHTML = `
        <strong>${sel === q.correct ? '✅ ¡Respuesta Correcta!' : `❌ Respuesta Incorrecta. La opción correcta es la ${q.correct}.`}</strong>
        <p style="margin-top: 0.35rem;">${escapeHtml(q.explanation)}</p>
      `;
    } else {
      feedbackWrap.style.display = 'none';
      feedbackWrap.innerHTML = '';
    }
  }

  const prevBtn = document.getElementById('btn-quiz-prev');
  if (prevBtn) prevBtn.disabled = (currentQuestionIndex === 0);

  const nextBtn = document.getElementById('btn-quiz-next');
  if (nextBtn) nextBtn.disabled = (currentQuestionIndex === list.length - 1);

  const dotsWrap = document.getElementById('quiz-progress-dots');
  if (dotsWrap) {
    dotsWrap.innerHTML = list.map((item, idx) => {
      const ans = userQuizAnswers[item.id];
      let dotCls = '';
      if (ans) dotCls = ans === item.correct ? 'dot-correct' : 'dot-wrong';
      if (idx === currentQuestionIndex) dotCls += ' active';
      return `<button onclick="jumpQuiz(${idx})" class="quiz-dot-btn ${dotCls}" title="Pregunta ${idx+1}"></button>`;
    }).join('');
  }
}

function answerQuiz(qId, letter) {
  userQuizAnswers[qId] = letter;
  renderQuiz();
}

function quizNext() {
  const list = getFilteredQuizList();
  if (currentQuestionIndex < list.length - 1) {
    currentQuestionIndex++;
    renderQuiz();
  }
}

function quizPrev() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuiz();
  }
}

function jumpQuiz(idx) {
  currentQuestionIndex = idx;
  renderQuiz();
}

function resetQuiz() {
  userQuizAnswers = {};
  currentQuestionIndex = 0;
  renderQuiz();
}

// 6. Tarjetas de Sustentación (Flashcards 3D)
function toggleFlashcard(cardWrap) {
  const inner = cardWrap.querySelector('.flashcard-inner');
  if (inner) inner.classList.toggle('is-flipped');
}

// Inicialización de la aplicación (Mejora progresiva)
document.addEventListener('DOMContentLoaded', () => {
  updateQuizScore();
});
