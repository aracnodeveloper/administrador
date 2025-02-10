import React, { useEffect, useState } from 'react';
import { PDFViewer, Document, Page, View, Text, StyleSheet, Font, Image, Svg, PDFDownloadLink } from '@react-pdf/renderer';
import montserratRegular from '../global/fonts/Montserrat/Montserrat-Regular.ttf';
import montserratBold from '../global/fonts/Montserrat/Montserrat-Bold.ttf';
import { useLocation } from 'react-router-dom';
import { listarReservas } from '../controllers/smart/SmartController';

Font.register({ family: 'Montserrat', src: montserratRegular });
Font.register({ family: 'Montserrat-Bold', src: montserratBold });

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
  

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    column: {
        flexGrow: 1,
        width: '50%',
    },
    title: {
        fontSize: 12,
        textAlign: 'left',
        fontFamily: 'Montserrat-Bold',
        fontWeight: 'black',
        color: '#4d4d4d'
    },
    paragraph: {
        fontSize: 8,
        textAlign: 'left',
        fontFamily: 'Montserrat',
        color: '#4d4d4d'
    },
    logoContainer: {
        width: '100%',
        aspectRatio: 1,
        height: 50,
        alignSelf: 'flex-start',
    },
    logo: {
        width: 75,
        height: '100%',
        objectFit: 'contain',
    },
    imageContainer: {
        width: '34%',
        aspectRatio: 1,
        height: 60,
        alignSelf: 'flex-start',
        marginRight: 4
    },
    image: {
        width: "100%",
        height: '100%',
        objectFit: 'cover',
    }
});

const MyDocument = ({ data }) => {
    return <Document filename="Reserva">
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <View style={{ ...styles.row, borderBottom: 0.5, borderBottomColor: 'gray', paddingBottom: 4, marginBottom: 4 }}>
                    <View style={{ ...styles.column, width: '15%' }}>
                        <View style={{ ...styles.logoContainer, width: 5 }}>
                            <Image src="/img/web/logo_verde.png" style={{ ...styles.logo }} />
                        </View>
                    </View>
                    <View style={{ ...styles.column, width: '85%' }}>
                        <Text style={styles.title}>
                            VisitaEcuador.com
                        </Text>
                        <Text style={{ ...styles.paragraph, fontSize: 10 }}>
                            Departamento de Ventas - Reservas
                        </Text>
                        <View style={{ ...styles.row }}>
                            <Text style={{ ...styles.paragraph, fontSize: 10 }}>
                                Fecha reserva:
                            </Text>
                            <Text style={{ ...styles.paragraph, fontSize: 10, marginLeft: 4 }}>
                                {data.reserva.fecha_creacion}
                            </Text>
                        </View>
                        <View style={{ ...styles.row }}>
                            <Text style={{ ...styles.paragraph, fontSize: 10 }}>
                                Reserva Nro:
                            </Text>
                            <Text style={{ ...styles.paragraph, fontSize: 10, marginLeft: 4 }}>
                                {data.reserva.id_tbl_reserva}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ ...styles.row, marginBottom: 8 }}>
                    <View style={{ ...styles.row, width: '50%' }}>
                        <Text style={{ ...styles.title, fontSize: 9 }}>
                            Suscriptor:
                        </Text>
                        <Text style={{ ...styles.paragraph, fontSize: 9, marginLeft: 4 }}>
                            {data.usuario[0].nombres}
                        </Text>
                    </View>
                    <View style={{ ...styles.row, width: '50%' }}>
                        <Text style={{ ...styles.title, fontSize: 9 }}>
                            Cédula / RUC:
                        </Text>
                        <Text style={{ ...styles.paragraph, fontSize: 9, marginLeft: 4 }}>
                            {data.usuario[0].ci_ruc}
                        </Text>
                    </View>
                </View>
                <View style={{ ...styles.row, borderBottom: 0.5, borderBottomColor: 'grey', paddingBottom: 4, marginBottom: 4 }}>
                    <View style={{ ...styles.row, width: '50%', }}>
                        <Text style={{ ...styles.title, fontSize: 9 }}>
                            Beneficiario:
                        </Text>
                        {
                            data.reserva.ci!=""
                            ?<Text style={{ ...styles.paragraph, fontSize: 9, marginLeft: 4 }}>
                                {data.reserva.nombres}
                            </Text>
                            :<Text style={{ ...styles.paragraph, fontSize: 9, marginLeft: 4 }}>
                                Sin beneficiario adicional
                            </Text>
                        }
                    </View>
                    {
                        data.reserva.ci!=""&&
                        <View style={{ ...styles.row, width: '50%' }}>
                            <Text style={{ ...styles.title, fontSize: 9 }}>
                                Cédula / RUC:
                            </Text>
                            <Text style={{ ...styles.paragraph, fontSize: 9, marginLeft: 4 }}>
                                {data.reserva.ci}
                            </Text>
                        </View>
                    }
                </View>
                <View style={{ ...styles.column, width: '100%' }}>
                    <Text style={{ ...styles.title, fontSize: 12, marginLeft: 4, textAlign: 'center', marginTop: 5, marginBottom: 10 }}>
                        Detalles de Ofertas
                    </Text>
                    <View style={{ ...styles.row }}>
                        <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '35%', border: 1, borderColor: 'grey' }}>
                            Oferta
                        </Text>
                        <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '35%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                            Establecimiento
                        </Text>
                        <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '15%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                            Personas
                        </Text>
                        <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '15%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                            Días / Noches
                        </Text>
                    </View>
                    {
                        data.ofertas.map((item) => (
                            <View style={{ ...styles.row }}>
                                <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '35%', border: 1, borderTop: 0, borderColor: 'grey',   }}>
                                    {truncateText(item.tituloOferta, 45)}
                                </Text>
                                <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '35%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                    {item.nombreEstablecimiento}
                                </Text>
                                <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '15%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                    {`${item.adultos} / ${item.ninos}`}
                                </Text>
                                <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '15%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                    {`${item.dias} / ${item.noches}`}
                                </Text>
                            </View>
                        ))
                    }
                    <View style={{ ...styles.column, width: '100%', marginTop:20 }}>
                        <Text style={{ ...styles.title, fontSize: 12, marginLeft: 4, textAlign: 'center', marginTop: 5, marginBottom: 10 }}>
                            Detalles de Reserva
                        </Text>
                        <View style={{ ...styles.row }}>
                            <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '10%', border: 1, borderColor: 'grey' }}>
                                Cantidad
                            </Text>
                            <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '50%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                                Descripción / Producto
                            </Text>
                            <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                                Ingreso
                            </Text>
                            <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                                Salida
                            </Text>
                            <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                                P. Unit. $
                            </Text>
                            <Text style={{ ...styles.title, fontSize: 10, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderColor: 'grey' }}>
                                P. Total $
                            </Text>
                        </View>
                        {
                            data.ofertas.map((item) => (
                                <>
                                <View style={{ ...styles.row }}>
                                    <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderTop: 0, borderColor: 'grey' }}>
                                        {item.cantidad_ofertas}
                                    </Text>
                                    <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '50%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                        {truncateText(item.tituloOferta, 65)}
                                    </Text>
                                    <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                        {`${item.fecha_inicio}`}
                                    </Text>
                                    <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                        {`${item.fecha_fin}`}
                                    </Text>
                                    <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                        {`$ ${parseFloat(item.precioOferta).toFixed(2)}`}
                                    </Text>
                                    <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                        {`$ ${((parseFloat(item.precioOferta) * parseFloat(item.cantidad_ofertas))).toFixed(2)}`}
                                    </Text>
                                </View>
                                {
                                    (item.adultos_extras!=""&&item.adultos_extras!="0")&&
                                    <View style={{ ...styles.row }}>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderTop: 0, borderColor: 'grey' }}>
                                            {item.adultos_extras}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '50%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`Adulto adicional / ${item.tituloOferta}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`${item.fecha_inicio}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`${item.fecha_fin}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`$ ${parseFloat(item.precio_adulto_adicional).toFixed(2)}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`$ ${(parseFloat(item.precio_adulto_adicional) * parseFloat(item.adultos_extras)).toFixed(2)}`}
                                        </Text>
                                    </View>
                                }
                                {
                                    (item.ninos_extras!=""&&item.ninos_extras!="0")&&
                                    <View style={{ ...styles.row }}>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderTop: 0, borderColor: 'grey' }}>
                                            {item.ninos_extras}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '50%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`Niño adicional / ${item.tituloOferta}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`${item.fecha_inicio}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`${item.fecha_fin}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`$ ${parseFloat(item.precio_nino_adicional).toFixed(2)}`}
                                        </Text>
                                        <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                            {`$ ${(parseFloat(item.precio_nino_adicional) * parseFloat(item.ninos_extras)).toFixed(2)}`}
                                        </Text>
                                    </View>
                                }
                                </>
                            ))
                        }
                         <View style={{ ...styles.row }}>
                            <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '80%', }}>
                            </Text>
                            <Text style={{ ...styles.title, fontSize: 8, textAlign: 'center', width: '10%', border: 1,borderLeft: 1, borderTop: 0, borderColor: 'grey' }}>
                                Total:
                            </Text>
                            <Text style={{ ...styles.paragraph, fontSize: 8, textAlign: 'center', width: '10%', border: 1, borderLeft: 0, borderTop: 0, borderColor: 'grey' }}>
                                {`$ ${data.reserva.total_reserva}`}
                            </Text>
                        </View>
                        <View style={{...styles.row, marginTop:20}}>
                            <Text style={{...styles.title, fontSize:8, marginRight:2}}>
                                Observaciones:
                            </Text>
                            <Text style={{...styles.paragraph, fontSize:8}}>
                                {data.reserva.comentario_reserva}
                            </Text>
                        </View>
                        <View style={{...styles.row, marginTop:20}}>
                            <View style={{...styles.column, width:"50%", alignItems:'center'}}>
                                <Text style={{...styles.title, fontSize:8}}>
                                    Elaborado por:
                                </Text>
                                <Text style={{...styles.paragraph, fontSize:8, borderTop:1, paddingHorizontal:20, paddingTop:2, marginTop:30, borderTopColor:'grey'}}>
                                    {data.reserva.gestor}
                                </Text>
                            </View>
                            <View style={{...styles.column, width:"50%", alignItems:'center'}}>
                                <Text style={{...styles.title, fontSize:8}}>
                                    Recibí conforme:
                                </Text>
                                <Text style={{...styles.paragraph, fontSize:8, borderTop:1, paddingHorizontal:20, paddingTop:2, marginTop:30, borderTopColor:'grey'}}>
                                    {data.usuario[0].nombres}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
};

const Reserva = () => {
    const location = useLocation();
    const [data, setData] = useState();
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
        listarReservas({id:searchParams.get('id')}).then((res) => {
            if (res) {
                console.log(res)
                setData(res)
            }
        })
    }, []);

    return (

        data && <div className="w-screen h-screen flex justify-center items-center">
            <PDFViewer className="w-full h-full" >
                <MyDocument data={data}></MyDocument>
            </PDFViewer>
        </div>

    );
};

export default Reserva;